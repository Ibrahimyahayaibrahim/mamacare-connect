import { createContext, useContext, useEffect, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("mamacare_language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("mamacare_language", language);
  }, [language]);

  function t(key) {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  }

  function toggleLanguage() {
    setLanguage((prev) => (prev === "en" ? "ha" : "en"));
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
