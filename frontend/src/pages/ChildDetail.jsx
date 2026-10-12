import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

const STATUS_STYLES = {
  Completed: "bg-sage-100 text-sage-700",
  Upcoming: "bg-clay-50 text-clay-600",
  "Due Today": "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-700",
};

const STATUS_KEYS = {
  Completed: "immunization_status_completed",
  Upcoming: "immunization_status_upcoming",
  "Due Today": "immunization_status_dueToday",
  Overdue: "immunization_status_overdue",
};

export default function ChildDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [child, setChild] = useState(null);
  const [immunizations, setImmunizations] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    Promise.all([
      api.get(`/children/${id}`),
      api.get(`/children/${id}/immunizations`),
    ]).then(([childRes, immRes]) => {
      setChild(childRes.data.child);
      setImmunizations(immRes.data.immunizations);
      setLoading(false);
    });
  }

  useEffect(load, [id]);

  async function toggleComplete(record) {
    const action = record.status === "Completed" ? "undo" : "complete";
    await api.put(`/children/${id}/immunizations/${record.id}/${action}`);
    load();
  }

  return (
    <div className="min-h-screen bg-clay-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/children" className="mb-4 inline-block text-sm text-sage-600 hover:underline">
          ← {t("child_back")}
        </Link>

        {child && (
          <h1 className="font-display mb-1 text-2xl font-semibold text-clay-600">{child.name}</h1>
        )}
        <p className="mb-6 text-sm font-medium text-sage-600">{t("immunization_title")}</p>

        {!loading && (
          <div className="space-y-3">
            {immunizations.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-sage-900">{record.vaccineName}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[record.status]}`}
                  >
                    {t(STATUS_KEYS[record.status])}
                  </span>
                </div>
                <p className="mb-3 text-xs text-sage-600">
                  {record.completedDate
                    ? `${t("immunization_completedOn")}: ${new Date(record.completedDate).toLocaleDateString()}`
                    : `${t("immunization_scheduledFor")}: ${new Date(record.scheduledDate).toLocaleDateString()} (${record.milestoneLabel})`}
                </p>
                <button
                  onClick={() => toggleComplete(record)}
                  className="rounded-full border border-sage-500 px-4 py-1.5 text-xs font-medium text-sage-700 hover:bg-sage-50"
                >
                  {record.status === "Completed"
                    ? t("immunization_undo")
                    : t("immunization_markDone")}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-sage-500">{t("immunization_disclaimer")}</p>
      </div>
    </div>
  );
}
