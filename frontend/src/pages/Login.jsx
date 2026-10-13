import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth_error_generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-clay-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-clay-100"
      >
        <h1 className="font-display mb-6 text-center text-2xl font-semibold text-clay-600">
          {t("auth_login_title")}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mb-3 block text-sm font-medium text-sage-800">
          {t("auth_email")}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-2 block text-sm font-medium text-sage-800">
          {t("auth_password")}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <Link
          to="/forgot-password"
          className="mb-6 block text-right text-sm text-clay-600 hover:underline"
        >
          {t("auth_forgotPassword")}
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-clay-500 py-2.5 font-semibold text-white shadow hover:bg-clay-600 disabled:opacity-60"
        >
          {t("auth_submit_login")}
        </button>

        <p className="mt-4 text-center text-sm text-sage-700">
          {t("auth_noAccount")}{" "}
          <Link to="/signup" className="font-medium text-clay-600 hover:underline">
            {t("nav_getStarted")}
          </Link>
        </p>
      </form>
    </div>
  );
}
