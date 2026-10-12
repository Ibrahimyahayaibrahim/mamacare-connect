import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Signup() {
  const { t, language, setLanguage } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    preferredLanguage: language,
    userType: "user",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t("auth_error_passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        preferredLanguage: form.preferredLanguage,
        userType: form.userType,
      });
      setLanguage(form.preferredLanguage);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth_error_generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-clay-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-clay-100"
      >
        <h1 className="font-display mb-6 text-center text-2xl font-semibold text-clay-600">
          {t("auth_signup_title")}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mb-3 block text-sm font-medium text-sage-800">
          {t("auth_name")}
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm font-medium text-sage-800">
          {t("auth_email")}
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm font-medium text-sage-800">
          {t("auth_phone")}
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm font-medium text-sage-800">
          {t("auth_password")}
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-sage-800">
          {t("auth_confirmPassword")}
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-sage-800">
          {t("auth_language")}
          <select
            value={form.preferredLanguage}
            onChange={(e) => update("preferredLanguage", e.target.value)}
            className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ha">Hausa</option>
          </select>
        </label>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-medium text-sage-800">{t("auth_userType")}</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                checked={form.userType === "user"}
                onChange={() => update("userType", "user")}
              />
              {t("auth_userType_user")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                checked={form.userType === "clinic"}
                onChange={() => update("userType", "clinic")}
              />
              {t("auth_userType_clinic")}
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-clay-500 py-2.5 font-semibold text-white shadow hover:bg-clay-600 disabled:opacity-60"
        >
          {t("auth_submit_signup")}
        </button>

        <p className="mt-4 text-center text-sm text-sage-700">
          {t("auth_haveAccount")}{" "}
          <Link to="/login" className="font-medium text-clay-600 hover:underline">
            {t("nav_login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
