import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`px-6 py-16 md:px-16 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

export default function Landing() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-clay-50 text-sage-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-clay-200 bg-clay-50/95 px-6 py-4 backdrop-blur md:px-16">
        <span className="font-display text-xl font-700 text-clay-600">MamaCare Connect</span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-sage-500 px-3 py-1 text-sm font-medium text-sage-700 hover:bg-sage-50"
            aria-label="Switch language"
          >
            {language === "en" ? "EN / HA" : "HA / EN"}
          </button>
          <Link to="/login" className="text-sm font-medium text-sage-700 hover:underline">
            {t("nav_login")}
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-clay-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-clay-600"
          >
            {t("nav_getStarted")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <Section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-600">
          {t("tagline")}
        </p>
        <h1 className="font-display mb-4 text-3xl font-bold leading-tight md:text-5xl">
          {t("hero_title")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-sage-800">{t("hero_body")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-full bg-clay-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-clay-600"
          >
            {t("hero_cta_primary")}
          </Link>
          <a
            href="#features"
            className="rounded-full border border-sage-500 px-6 py-3 font-semibold text-sage-700 hover:bg-sage-50"
          >
            {t("hero_cta_secondary")}
          </a>
        </div>
      </Section>

      {/* Challenge / Solution */}
      <Section className="grid gap-10 bg-white md:grid-cols-2">
        <div>
          <h2 className="font-display mb-3 text-2xl font-semibold text-clay-600">
            {t("challenge_title")}
          </h2>
          <p className="text-sage-800">{t("challenge_body")}</p>
        </div>
        <div>
          <h2 className="font-display mb-3 text-2xl font-semibold text-sage-600">
            {t("solution_title")}
          </h2>
          <p className="text-sage-800">{t("solution_body")}</p>
        </div>
      </Section>

      {/* Features */}
      <Section id="features">
        <h2 className="font-display mb-8 text-center text-2xl font-semibold">
          {t("features_title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "feature_pregnancy",
            "feature_immunization",
            "feature_nutrition",
            "feature_ai",
            "feature_familyplanning",
            "feature_reminders",
          ].map((key) => (
            <div key={key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-clay-100">
              <p className="font-medium text-sage-800">{t(key)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-sage-50">
        <h2 className="font-display mb-8 text-center text-2xl font-semibold">{t("how_title")}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-500 font-semibold text-white">
                {n}
              </div>
              <h3 className="font-display mb-1 font-semibold">{t(`how_step${n}_title`)}</h3>
              <p className="text-sm text-sage-700">{t(`how_step${n}_body`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Safety */}
      <Section className="bg-white">
        <div className="rounded-2xl border-l-4 border-clay-400 bg-clay-50 p-6">
          <h2 className="font-display mb-2 text-xl font-semibold text-clay-700">
            {t("safety_title")}
          </h2>
          <p className="text-sage-800">{t("safety_body")}</p>
        </div>
      </Section>

      {/* Privacy */}
      <Section>
        <h2 className="font-display mb-2 text-xl font-semibold">{t("privacy_title")}</h2>
        <p className="text-sage-800">{t("privacy_body")}</p>
      </Section>

      {/* Contact */}
      <Section className="bg-sage-900 text-clay-50">
        <h2 className="font-display mb-2 text-xl font-semibold">{t("contact_title")}</h2>
        <p className="mb-1">{t("contact_body")}</p>
        <p className="text-sage-200">support@mamacareconnect.example</p>
      </Section>

      <footer className="px-6 py-6 text-center text-xs text-sage-500 md:px-16">
        © {new Date().getFullYear()} {t("footer_rights")}
      </footer>
    </div>
  );
}
