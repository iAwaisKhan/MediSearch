"use strict";
const { GoogleGenAI } = require("@google/genai");
const logger    = require("../utils/logger");
const AppError  = require("../utils/AppError");

const MODEL  = "gemini-2.5-flash";
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Prompt builders ────────────────────────────────────────────────────────
function buildSearchPrompt(name, lang) {
  const langInstr =
    lang === "hi"
      ? "Respond with ALL descriptive text fields in Hindi (Devanagari script). Keep medicine names, brand names, and manufacturer names in English."
      : "Respond in English.";

  return `You are a senior clinical pharmacist. Provide complete, accurate information about the medicine: "${name}". ${langInstr}

Respond ONLY with a single JSON object (no markdown fences, no extra text, no comments). Output exactly this schema:
{
  "name": "Full medicine name (English)",
  "genericName": "INN/generic name",
  "category": "Drug class/pharmacological category",
  "emoji": "one clinically relevant emoji",
  "purpose": "Primary indications and therapeutic uses (2-3 sentences)",
  "howToTake": ["Instruction 1", "Instruction 2", "Instruction 3", "Instruction 4"],
  "dosage": "Standard adult dosage with frequency",
  "suitableFor": ["Patient group 1", "group 2", "group 3"],
  "notSuitableFor": ["Contraindication 1", "contraindication 2", "contraindication 3"],
  "sideEffects": ["Common effect 1", "effect 2", "effect 3", "effect 4", "effect 5"],
  "precautions": ["Precaution 1", "precaution 2", "precaution 3", "precaution 4"],
  "interactions": ["Drug interaction 1", "interaction 2", "interaction 3"],
  "storage": "Storage conditions and shelf life guidance",
  "warning": "Critical safety warning (1-2 sentences — most important alert)",
  "generics": [
    {"name": "Real Indian generic brand 1", "price": "approx INR per strip/pack", "manufacturer": "Company name", "savings": 40},
    {"name": "Real Indian generic brand 2", "price": "approx INR per strip/pack", "manufacturer": "Company name", "savings": 55},
    {"name": "Real Indian generic brand 3", "price": "approx INR per strip/pack", "manufacturer": "Company name", "savings": 65}
  ]
}

If the input is not a valid medicine name, return exactly: {"error": "Medicine not found"}`;
}

function buildComparePrompt(medA, medB, lang) {
  const langInstr =
    lang === "hi"
      ? "Respond with all descriptive text in Hindi (Devanagari). Keep medicine names, brand names in English."
      : "Respond in English.";

  return `You are a senior clinical pharmacist. Compare these two medicines: "${medA}" and "${medB}". ${langInstr}

Respond ONLY with a JSON array of exactly 2 medicine objects (no markdown fences). Output exactly this schema for both:
[
  {
    "name": "Medicine A name",
    "genericName": "generic",
    "category": "class",
    "emoji": "emoji",
    "purpose": "2-3 sentence purpose",
    "dosage": "standard dosage",
    "howToTake": ["step 1", "step 2"],
    "suitableFor": ["group 1", "group 2"],
    "notSuitableFor": ["condition 1", "condition 2"],
    "sideEffects": ["effect 1", "effect 2", "effect 3"],
    "precautions": ["precaution 1", "precaution 2"],
    "interactions": ["drug 1", "drug 2"],
    "storage": "storage instructions",
    "warning": "key warning",
    "generics": [
      {"name": "Generic 1", "price": "INR price", "manufacturer": "Company", "savings": 45},
      {"name": "Generic 2", "price": "INR price", "manufacturer": "Company", "savings": 60}
    ]
  },
  { "...same structure for ${medB}..." }
]`;
}

// ── Core call ──────────────────────────────────────────────────────────────
async function callLLM7(prompt) {
  if (!process.env.LLM7_API_KEY) {
    throw new Error("LLM7 API Key not found");
  }

  // Bypass self-signed certificate error for api.llm7.io
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const response = await fetch("https://api.llm7.io/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LLM7_API_KEY}`
    },
    body: JSON.stringify({
      model: "default",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM7 API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("mock")) {
    logger.info("Using mock AI response");
    if (prompt.includes("Compare these two medicines")) {
      return [
        {
          "name": "Mock Medicine A",
          "genericName": "Mock Generic A",
          "category": "Painkiller",
          "emoji": "💊",
          "purpose": "Used to relieve mild to moderate pain.",
          "dosage": "1 tablet every 6 hours",
          "howToTake": ["Take with food"],
          "suitableFor": ["Adults"],
          "notSuitableFor": ["Children under 12"],
          "sideEffects": ["Nausea", "Dizziness"],
          "precautions": ["Avoid alcohol"],
          "interactions": ["Other NSAIDs"],
          "storage": "Store in a cool dry place",
          "warning": "Do not exceed maximum daily dose.",
          "generics": []
        },
        {
          "name": "Mock Medicine B",
          "genericName": "Mock Generic B",
          "category": "Painkiller",
          "emoji": "💊",
          "purpose": "Used to relieve severe pain.",
          "dosage": "1 tablet every 8 hours",
          "howToTake": ["Take with food"],
          "suitableFor": ["Adults"],
          "notSuitableFor": ["Children under 12"],
          "sideEffects": ["Drowsiness", "Constipation"],
          "precautions": ["May impair driving"],
          "interactions": ["Sedatives"],
          "storage": "Store in a cool dry place",
          "warning": "High risk of dependence.",
          "generics": []
        }
      ];
    } else {
      return {
        "name": "Mock Medicine",
        "genericName": "Mock Generic",
        "category": "Mock Category",
        "emoji": "💊",
        "purpose": "This is a mocked medicine response because a valid GEMINI_API_KEY was not provided.",
        "howToTake": ["Take with water"],
        "dosage": "1 mock pill",
        "suitableFor": ["Anyone testing the UI"],
        "notSuitableFor": ["Production environments"],
        "sideEffects": ["Fake symptom"],
        "precautions": ["None"],
        "interactions": ["None"],
        "storage": "Keep in codebase",
        "warning": "This is entirely mock data.",
        "generics": []
      };
    }
  }

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (err) {
    logger.error(`Gemini API error: ${err.message}`);
    if (err instanceof SyntaxError) {
      throw new AppError("AI returned an unparseable response. Please try again.", 502);
    }
    throw new AppError(err.message || "AI service unavailable", 503);
  }
}

// ── Public helpers ─────────────────────────────────────────────────────────
async function fetchMedicine(name, lang = "en") {
  const prompt = buildSearchPrompt(name, lang);
  try {
    return await callLLM7(prompt);
  } catch (err) {
    logger.warn(`LLM7 failed for search, falling back to Gemini: ${err.message}`);
    return await callGemini(prompt);
  }
}

async function fetchCompare(medA, medB, lang = "en") {
  const prompt = buildComparePrompt(medA, medB, lang);
  try {
    return await callLLM7(prompt);
  } catch (err) {
    logger.warn(`LLM7 failed for compare, falling back to Gemini: ${err.message}`);
    return await callGemini(prompt);
  }
}

module.exports = { fetchMedicine, fetchCompare };
