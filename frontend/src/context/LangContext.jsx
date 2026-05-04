import { createContext, useContext, useState } from "react";

const LangContext = createContext(null);

export const translations = {
  en: {
    appName: "MediSearch",
    tagline: "Know Your Medicine",
    heroSub: "AI-powered medicine information in seconds — safe, clear, trusted.",
    search: "Search", compare: "Compare", history: "History",
    login: "Log In", register: "Register", logout: "Logout",
    profile: "Profile", settings: "Settings",
    searchPlaceholder: "e.g. Paracetamol, Metformin…",
    comparePlaceholder1: "Medicine 1 (e.g. Paracetamol)",
    comparePlaceholder2: "Medicine 2 (e.g. Ibuprofen)",
    searchBtn: "Search", compareBtn: "Compare",
    try: "Try:", notFound: "Medicine not found.",
    purpose: "Purpose & Uses", dosage: "Dosage",
    howTo: "How to Take", side: "Side Effects",
    suitable: "Suitable For", avoid: "Not Suitable For",
    precaution: "Precautions", interact: "Drug Interactions",
    storage: "Storage", warning: "Important Warning",
    generics: "Generic & Cheaper Alternatives",
    disclaimer: "For educational purposes only. Always consult a qualified doctor or pharmacist.",
    cachedResult: "Cached Result",
    searchHistory: "Search History", noHistory: "No history yet.",
    clearAll: "Clear All", deleteItem: "Delete",
    totalSearches: "Total Searches", avgResponse: "Avg Response",
    topSearches: "Top Searches",
    name: "Name", email: "Email", password: "Password",
    confirmPass: "Confirm Password", save: "Save Changes",
    currentPass: "Current Password", newPass: "New Password",
    loading: "Loading…", error: "Something went wrong.",
    pregnancySafe: "Safe in pregnancy?", forChildren: "For children?",
    overdoseRisk: "Overdose risk?", alternatives: "Alternatives?",
    whichBetter: "Which is better?", canTakeTogether: "Can take together?",
  },
  hi: {
    appName: "MediSearch",
    tagline: "दवाई को जानें",
    heroSub: "AI से दवाओं की पूरी जानकारी — सुरक्षित, स्पष्ट, विश्वसनीय।",
    search: "खोजें", compare: "तुलना", history: "इतिहास",
    login: "लॉग इन", register: "रजिस्टर", logout: "लॉगआउट",
    profile: "प्रोफाइल", settings: "सेटिंग",
    searchPlaceholder: "जैसे Paracetamol, Metformin…",
    comparePlaceholder1: "दवा 1 (जैसे Paracetamol)",
    comparePlaceholder2: "दवा 2 (जैसे Ibuprofen)",
    searchBtn: "खोजें", compareBtn: "तुलना करें",
    try: "देखें:", notFound: "दवा नहीं मिली।",
    purpose: "उद्देश्य और उपयोग", dosage: "खुराक",
    howTo: "कैसे लें", side: "दुष्प्रभाव",
    suitable: "किसके लिए उपयुक्त", avoid: "किसे नहीं लेनी चाहिए",
    precaution: "सावधानियां", interact: "दवा प्रतिक्रिया",
    storage: "संग्रहण", warning: "महत्वपूर्ण चेतावनी",
    generics: "जेनेरिक और सस्ती दवाएं",
    disclaimer: "यह जानकारी केवल शैक्षणिक उद्देश्यों के लिए है। कोई भी दवा लेने से पहले डॉक्टर से परामर्श करें।",
    cachedResult: "कैश्ड परिणाम",
    searchHistory: "खोज इतिहास", noHistory: "अभी कोई इतिहास नहीं।",
    clearAll: "सब हटाएं", deleteItem: "हटाएं",
    totalSearches: "कुल खोजें", avgResponse: "औसत समय",
    topSearches: "शीर्ष खोजें",
    name: "नाम", email: "ईमेल", password: "पासवर्ड",
    confirmPass: "पासवर्ड की पुष्टि", save: "सहेजें",
    currentPass: "वर्तमान पासवर्ड", newPass: "नया पासवर्ड",
    loading: "लोड हो रहा है…", error: "कुछ गलत हुआ।",
    pregnancySafe: "गर्भावस्था में सुरक्षित?", forChildren: "बच्चों के लिए?",
    overdoseRisk: "अधिक मात्रा का खतरा?", alternatives: "विकल्प?",
    whichBetter: "कौन सी बेहतर?", canTakeTogether: "दोनों एक साथ?",
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ms_lang") || "en"
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("ms_lang", l);
  };

  const t = (key) => translations[lang][key] || translations.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be inside LangProvider");
  return ctx;
};
