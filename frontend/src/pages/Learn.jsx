import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

export default function Learn() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/health-education/categories").then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    const timeout = setTimeout(() => {
      api.get("/health-education/articles", { params }).then((res) => setArticles(res.data.articles));
    }, 250);
    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  if (selected) {
    return (
      <div className="min-h-screen bg-clay-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-sm text-sage-600 hover:underline"
          >
            ← {t("learn_back")}
          </button>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-500">
              {selected.category?.name?.[language]}
            </p>
            <h1 className="font-display mb-4 text-2xl font-semibold text-clay-600">
              {selected.title[language]}
            </h1>
            <p className="whitespace-pre-line text-sage-800">{selected.content[language]}</p>
            {selected.source && (
              <p className="mt-6 text-xs text-sage-500">
                {t("learn_source")}: {selected.source}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clay-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="mb-4 inline-block text-sm text-sage-600 hover:underline">
          ← {t("dashboard_welcome")}
        </Link>
        <h1 className="font-display mb-6 text-2xl font-semibold text-clay-600">{t("learn_title")}</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("learn_searchPlaceholder")}
          className="mb-4 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={`rounded-full px-3 py-1 text-sm ${
              activeCategory === "" ? "bg-clay-500 text-white" : "bg-white text-sage-700 ring-1 ring-clay-100"
            }`}
          >
            {t("learn_allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c.slug)}
              className={`rounded-full px-3 py-1 text-sm ${
                activeCategory === c.slug
                  ? "bg-clay-500 text-white"
                  : "bg-white text-sage-700 ring-1 ring-clay-100"
              }`}
            >
              {c.name[language]}
            </button>
          ))}
        </div>

        {articles.length === 0 && <p className="text-sage-700">{t("learn_noResults")}</p>}

        <div className="space-y-3">
          {articles.map((a) => (
            <button
              key={a._id}
              onClick={() => setSelected(a)}
              className="block w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sage-500">
                {a.category?.name?.[language]}
              </p>
              <p className="font-medium text-sage-900">{a.title[language]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
