"use strict";
const { GoogleGenAI } = require("@google/genai");
const catchAsync = require("../utils/catchAsync");
const AppError   = require("../utils/AppError");
const logger     = require("../utils/logger");

const MODEL  = "gemini-2.5-flash";
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── OCR: extract medicine names from an image ───────────────────────────
exports.extractMedicineFromImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No image file uploaded.", 400));
  }

  const start = Date.now();

  // Mock mode — return stub data when no real API key
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("mock")) {
    logger.info("OCR: Using mock response (no GEMINI_API_KEY)");
    return res.status(200).json({
      status: "success",
      data: {
        type: "prescription",
        patient_name: "John Doe",
        date: "2023-10-25",
        doctor_notes: "Take after meals.",
        medicines: [
          { name: "Paracetamol", dosage: "500mg", frequency: "Twice a day", duration: "5 days", instructions: "After meals" },
          { name: "Amoxicillin", dosage: "250mg", frequency: "Once a day", duration: "3 days", instructions: "Before bed" }
        ]
      },
    });
  }

  try {
    // Convert the in-memory buffer to a base64 string for the Gemini API
    const base64Image = req.file.buffer.toString("base64");
    const mimeType    = req.file.mimetype; // e.g. "image/jpeg"

    const prompt = `You are a pharmaceutical OCR expert. Analyze this image and determine if it is a single medicine package/pill box OR a medical prescription.

If it is a medicine box, extract the medicine names.
If it is a prescription, extract the patient details, doctor notes, and a structured list of ALL prescribed medicines including their dosage, frequency, duration, and specific instructions.

Rules:
1. Return ONLY a JSON object. No markdown fences, no extra text.
2. Use this exact schema:
{
  "type": "prescription" | "medicine_box",
  "patient_name": "string | null",
  "date": "string | null",
  "doctor_notes": "string | null",
  "medicines": [
    {
      "name": "string",
      "dosage": "string | null",
      "frequency": "string | null",
      "duration": "string | null",
      "instructions": "string | null"
    }
  ],
  "message": "string | null"
}
3. Use the standard/common medicine name (e.g., "Paracetamol" not "PCM").
4. If the image contains brand names, include the brand name as the name.
5. If NO medicine names are found, return empty array for medicines and add a message.`;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = response.text;
    text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(text);

    logger.info(`OCR extracted ${parsed.medicines?.length || 0} medicine(s) in ${Date.now() - start}ms`);

    return res.status(200).json({
      status: "success",
      data: parsed,
    });
  } catch (err) {
    logger.error(`OCR Gemini error: ${err.message}`);
    if (err instanceof SyntaxError) {
      return next(new AppError("AI returned an unparseable OCR response. Please try again.", 502));
    }
    return next(new AppError(err.message || "OCR service unavailable", 503));
  }
});

export {};
