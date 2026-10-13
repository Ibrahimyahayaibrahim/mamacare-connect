import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

export default function ChildNutrition() {
  const { t, language } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    api.get("/child-nutrition/pap-recipes").then((res) => setRecipes(res.data.recipes));
    api.get("/child-nutrition/fruit-guides").then((res) => setFruits(res.data.fruits));
  }, []);

  return (
    <div className="min-h-screen bg-clay-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="mb-4 inline-block text-sm text-sage-600 hover:underline">
          ← {t("dashboard_welcome")}
        </Link>
        <h1 className="font-display mb-4 text-2xl font-semibold text-clay-600">
          {t("nutrition_title")}
        </h1>

        <div className="mb-8 rounded-2xl border-l-4 border-clay-400 bg-clay-50 p-4 text-sm text-sage-800">
          {t("nutrition_safetyBanner")}
        </div>

        <h2 className="font-display mb-3 text-xl font-semibold text-sage-800">
          {t("nutrition_papTitle")}
        </h2>
        <div className="mb-10 space-y-4">
          {recipes.map((r) => (
            <details key={r._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100">
              <summary className="cursor-pointer font-medium text-sage-900">{r.name[language]}</summary>
              <div className="mt-3 space-y-2 text-sm text-sage-700">
                <p>
                  <span className="font-semibold">{t("nutrition_ageSuitability")}:</span>{" "}
                  {r.ageSuitability[language]}
                </p>
                <div>
                  <p className="font-semibold">{t("nutrition_ingredients")}:</p>
                  <ul className="ml-4 list-disc">
                    {r.ingredients[language].map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">{t("nutrition_steps")}:</p>
                  <ol className="ml-4 list-decimal">
                    {r.steps[language].map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <p>
                  <span className="font-semibold">{t("nutrition_benefit")}:</span>{" "}
                  {r.nutritionBenefit[language]}
                </p>
                <p>
                  <span className="font-semibold">{t("nutrition_storage")}:</span>{" "}
                  {r.storageAdvice[language]}
                </p>
              </div>
            </details>
          ))}
        </div>

        <h2 className="font-display mb-3 text-xl font-semibold text-sage-800">
          {t("nutrition_fruitTitle")}
        </h2>
        <div className="space-y-4">
          {fruits.map((f) => (
            <details key={f._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100">
              <summary className="cursor-pointer font-medium text-sage-900">{f.name[language]}</summary>
              <div className="mt-3 space-y-2 text-sm text-sage-700">
                <p>
                  <span className="font-semibold">{t("nutrition_benefits")}:</span> {f.benefits[language]}
                </p>
                <p>
                  <span className="font-semibold">{t("nutrition_preparation")}:</span>{" "}
                  {f.preparation[language]}
                </p>
                <p>
                  <span className="font-semibold">{t("nutrition_chokingSafety")}:</span>{" "}
                  {f.chokingSafety[language]}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
