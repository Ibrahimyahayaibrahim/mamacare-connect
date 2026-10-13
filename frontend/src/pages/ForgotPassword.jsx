import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [devToken, setDevToken] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStatus(res.data.message);
      setDevToken(res.data.devOnlyResetToken || null);
    } catch {
      setStatus(t("auth_error_generic"));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-clay-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-clay-100"
      >
        <h1 className="font-display mb-6 text-center text-2xl font-semibold text-clay-600">
          {t("auth_forgotPassword")}
        </h1>

        <label className="mb-4 block text-sm font-medium text-sage-800">
          {t("auth_email")}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-clay-500 py-2.5 font-semibold text-white shadow hover:bg-clay-600"
        >
          {t("auth_submit_login")}
        </button>

        {status && <p className="mt-4 text-center text-sm text-sage-700">{status}</p>}
        {devToken && (
          <p className="mt-2 break-all rounded-lg bg-sage-50 p-2 text-xs text-sage-600">
            Dev-only reset token (remove once email is wired up): {devToken}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-sage-700">
          <Link to="/login" className="font-medium text-clay-600 hover:underline">
            {t("nav_login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
