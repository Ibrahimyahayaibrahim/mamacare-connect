import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const roleLabel =
    user?.userType === "clinic"
      ? "dashboard_role_clinic"
      : user?.userType === "admin"
      ? "dashboard_role_admin"
      : "dashboard_role_user";

  return (
    <div className="min-h-screen bg-clay-50">
      <header className="flex items-center justify-between border-b border-clay-200 bg-white px-6 py-4">
        <span className="font-display text-lg font-semibold text-clay-600">MamaCare Connect</span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-sage-500 px-3 py-1 text-sm text-sage-700 hover:bg-sage-50"
          >
            {language === "en" ? "EN / HA" : "HA / EN"}
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-clay-400 px-4 py-1.5 text-sm font-medium text-clay-600 hover:bg-clay-50"
          >
            {t("dashboard_logout")}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display mb-1 text-2xl font-semibold text-sage-900">
          {t("dashboard_welcome")}, {user?.name}
        </h1>
        <p className="mb-6 text-sm font-medium text-sage-600">{t(roleLabel)}</p>

        {user?.userType === "user" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/pregnancy"
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="font-display font-semibold text-clay-600">{t("nav_pregnancy")}</p>
            </Link>
            <Link
              to="/children"
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="font-display font-semibold text-clay-600">{t("nav_children")}</p>
            </Link>
            <Link
              to="/learn"
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="font-display font-semibold text-clay-600">{t("nav_learn")}</p>
            </Link>
            <Link
              to="/nutrition"
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="font-display font-semibold text-clay-600">{t("nav_nutrition")}</p>
            </Link>
            <Link
              to="/family-planning"
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 hover:ring-clay-300"
            >
              <p className="font-display font-semibold text-clay-600">{t("nav_familyplanning")}</p>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100">
            <p className="text-sage-700">{t("dashboard_placeholder")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
