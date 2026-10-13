import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

function MethodCard({ m, language, t, selected, onToggle }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100">
      <label className="mb-2 flex items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(m._id)}
          className="mt-1"
        />
        <span className="font-medium text-sage-900">{m.name[language]}</span>
      </label>
      <p className="mb-2 text-sm text-sage-700">{m.description[language]}</p>
      <p className="text-xs text-sage-600">
        <span className="font-semibold">{t("fp_effectiveness")}:</span> {m.effectiveness[language]}
      </p>
    </div>
  );
}

function ComparisonTable({ methods, language, t }) {
  const rows = [
    ["fp_duration", "duration"],
    ["fp_mechanism", "mechanism"],
    ["fp_effectiveness", "effectiveness"],
    ["fp_considerations", "considerations"],
  ];
  return (
    <div className="mb-8 overflow-x-auto rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100">
      <table className="w-full min-w-[500px] text-left text-sm">
        <thead>
          <tr>
            <th className="p-2"></th>
            {methods.map((m) => (
              <th key={m._id} className="p-2 font-semibold text-clay-600">
                {m.name[language]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([labelKey, field]) => (
            <tr key={field} className="border-t border-clay-100">
              <td className="p-2 font-medium text-sage-700">{t(labelKey)}</td>
              {methods.map((m) => (
                <td key={m._id} className="p-2 text-sage-800">
                  {m[field][language]}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-clay-100">
            <td className="p-2 font-medium text-sage-700">{t("fp_advantages")}</td>
            {methods.map((m) => (
              <td key={m._id} className="p-2 text-sage-800">
                <ul className="list-disc pl-4">
                  {m.advantages[language].map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr className="border-t border-clay-100">
            <td className="p-2 font-medium text-sage-700">{t("fp_sideEffects")}</td>
            {methods.map((m) => (
              <td key={m._id} className="p-2 text-sage-800">
                <ul className="list-disc pl-4">
                  {m.sideEffects[language].map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Reminders({ t }) {
  const [reminders, setReminders] = useState([]);
  const [label, setLabel] = useState("");
  const [dueDate, setDueDate] = useState("");

  function load() {
    api.get("/family-planning/reminders").then((res) => setReminders(res.data.reminders));
  }
  useEffect(load, []);

  async function addReminder(e) {
    e.preventDefault();
    await api.post("/family-planning/reminders", { label, dueDate });
    setLabel("");
    setDueDate("");
    load();
  }

  async function toggleDone(r) {
    await api.put(`/family-planning/reminders/${r._id}`, { isDone: !r.isDone });
    load();
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-clay-100">
      <h3 className="font-display mb-3 font-semibold text-sage-800">{t("fp_remindersTitle")}</h3>
      <form onSubmit={addReminder} className="mb-4 flex flex-wrap gap-2">
        <input
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("fp_reminderLabel")}
          className="flex-1 rounded-lg border border-sage-200 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none"
        />
        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-sage-200 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none"
        />
        <button className="rounded-full bg-clay-500 px-4 py-2 text-sm font-semibold text-white hover:bg-clay-600">
          {t("fp_reminderAdd")}
        </button>
      </form>
      {reminders.length === 0 && <p className="text-sm text-sage-600">{t("fp_reminderNone")}</p>}
      <div className="space-y-2">
        {reminders.map((r) => (
          <label key={r._id} className="flex items-center gap-2 text-sm text-sage-800">
            <input type="checkbox" checked={r.isDone} onChange={() => toggleDone(r)} />
            <span className={r.isDone ? "line-through text-sage-400" : ""}>
              {r.label} — {new Date(r.dueDate).toLocaleDateString()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FamilyPlanning() {
  const { t, language } = useLanguage();
  const [methods, setMethods] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compared, setCompared] = useState([]);

  useEffect(() => {
    api.get("/family-planning/methods").then((res) => setMethods(res.data.methods));
  }, []);

  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleCompare() {
    if (selectedIds.length < 2) return;
    const res = await api.get("/family-planning/compare", { params: { ids: selectedIds.join(",") } });
    setCompared(res.data.methods);
  }

  return (
    <div className="min-h-screen bg-clay-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="mb-4 inline-block text-sm text-sage-600 hover:underline">
          ← {t("dashboard_welcome")}
        </Link>
        <h1 className="font-display mb-2 text-2xl font-semibold text-clay-600">{t("fp_title")}</h1>
        <p className="mb-6 text-sm text-sage-700">{t("fp_intro")}</p>

        <Reminders t={t} />

        <h2 className="font-display mb-3 mt-8 text-lg font-semibold text-sage-800">
          {t("fp_compareSelect")}
        </h2>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {methods.map((m) => (
            <MethodCard
              key={m._id}
              m={m}
              language={language}
              t={t}
              selected={selectedIds.includes(m._id)}
              onToggle={toggle}
            />
          ))}
        </div>

        <button
          onClick={handleCompare}
          disabled={selectedIds.length < 2}
          className="mb-6 rounded-full bg-sage-500 px-6 py-2.5 font-semibold text-white shadow hover:bg-sage-600 disabled:opacity-50"
        >
          {t("fp_compareButton")}
        </button>

        {compared.length > 0 ? (
          <ComparisonTable methods={compared} language={language} t={t} />
        ) : (
          <p className="mb-8 text-sm text-sage-600">{t("fp_compareEmpty")}</p>
        )}
      </div>
    </div>
  );
}
