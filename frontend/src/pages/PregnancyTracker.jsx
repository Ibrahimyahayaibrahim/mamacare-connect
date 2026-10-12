import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function PregnancyTracker() {
  const { t } = useLanguage();
  const [pregnancy, setPregnancy] = useState(undefined); // undefined = loading, null = none yet
  const [lmpDate, setLmpDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/pregnancies/mine").then((res) => setPregnancy(res.data.pregnancy));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await api.post("/pregnancies", { lmpDate, notes });
      setPregnancy(res.data.pregnancy);
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
        <h1 className="font-display mb-6 text-2xl font-semibold text-clay-600">
          {t("pregnancy_title")}
        </h1>

        {pregnancy === undefined && <p className="text-sage-600">…</p>}

        {pregnancy && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100">
            <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-clay-100">
              <div
                className="h-full rounded-full bg-sage-500 transition-all"
                style={{ width: `${pregnancy.progressPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              <div>
                <p className="text-2xl font-bold text-clay-600">{pregnancy.week}</p>
                <p className="text-xs text-sage-600">{t("pregnancy_week")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-clay-600">{pregnancy.trimester}</p>
                <p className="text-xs text-sage-600">{t("pregnancy_trimester")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-clay-600">{pregnancy.daysRemaining}</p>
                <p className="text-xs text-sage-600">{t("pregnancy_daysRemaining")}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-clay-600">{fmtDate(pregnancy.eddDate)}</p>
                <p className="text-xs text-sage-600">{t("pregnancy_edd")}</p>
              </div>
            </div>
            {pregnancy.isPastDueDate && (
              <p className="mt-4 rounded-lg bg-clay-50 p-3 text-sm text-clay-700">
                {t("pregnancy_pastDue")}
              </p>
            )}
            <p className="mt-4 text-xs text-sage-500">{t("pregnancy_disclaimer")}</p>
          </div>
        )}

        {pregnancy === null && (
          <p className="mb-4 text-sage-700">{t("pregnancy_empty")}</p>
        )}

        {pregnancy !== undefined && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100"
          >
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <label className="mb-3 block text-sm font-medium text-sage-800">
              {t("pregnancy_lmp_label")}
              <input
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
              />
            </label>
            <label className="mb-4 block text-sm font-medium text-sage-800">
              {t("pregnancy_notes_label")}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 focus:border-sage-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-clay-500 px-6 py-2.5 font-semibold text-white shadow hover:bg-clay-600 disabled:opacity-60"
            >
              {t("pregnancy_save")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
