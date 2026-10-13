import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

export default function Children() {
  const { t } = useLanguage();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", sex: "male", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function loadChildren() {
    api.get("/children").then((res) => {
      setChildren(res.data.children);
      setLoading(false);
    });
  }

  useEffect(loadChildren, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/children", form);
      setForm({ name: "", dob: "", sex: "male", notes: "" });
      setShowForm(false);
      loadChildren();
    } catch (err) {
      setError(err.response?.data?.message || t("auth_error_generic"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-clay-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="mb-4 inline-block text-sm text-sage-600 hover:underline">
          ← {t("dashboard_welcome")}
        </Link>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-clay-600">
            {t("children_title")}
          </h1>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-full bg-clay-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-clay-600"
          >
            {t("children_add")}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100"
          >
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <label className="mb-3 block text-sm font-medium text-sage-800">
              {t("child_name")}
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
              />
            </label>
            <label className="mb-3 block text-sm font-medium text-sage-800">
              {t("child_dob")}
              <input
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
              />
            </label>
            <fieldset className="mb-3">
              <legend className="mb-1 text-sm font-medium text-sage-800">{t("child_sex")}</legend>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.sex === "male"}
                    onChange={() => setForm({ ...form, sex: "male" })}
                  />
                  {t("child_sex_male")}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.sex === "female"}
                    onChange={() => setForm({ ...form, sex: "female" })}
                  />
                  {t("child_sex_female")}
                </label>
              </div>
            </fieldset>
            <label className="mb-4 block text-sm font-medium text-sage-800">
              {t("child_notes")}
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-clay-500 px-6 py-2.5 font-semibold text-white shadow hover:bg-clay-600 disabled:opacity-60"
            >
              {t("child_save")}
            </button>
          </form>
        )}

        {!loading && children.length === 0 && !showForm && (
          <p className="text-sage-700">{t("children_empty")}</p>
        )}

        <div className="space-y-3">
          {children.map((child) => (
            <div
              key={child._id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100"
            >
              <div>
                <p className="font-medium text-sage-900">{child.name}</p>
                <p className="text-xs text-sage-600">
                  {new Date(child.dob).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/children/${child._id}`}
                className="text-sm font-medium text-clay-600 hover:underline"
              >
                {t("child_view")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
