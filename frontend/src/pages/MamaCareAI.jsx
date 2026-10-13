import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../i18n/LanguageContext";

const SUGGESTED_TOPIC_KEYS_EN = [
  "Pregnancy trimesters",
  "Immunization",
  "Child nutrition",
  "Breastfeeding",
  "Family planning",
  "Danger signs",
];
const SUGGESTED_TOPIC_KEYS_HA = [
  "Kashi na ciki",
  "Allurar rigakafi",
  "Abincin yara",
  "Shayarwa",
  "Tsare-tsaren iyali",
  "Alamun hadari",
];

export default function MamaCareAI() {
  const { t, language } = useLanguage();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  async function startConversation() {
    const res = await api.post("/ai/conversations", { language });
    setConversation(res.data.conversation);
    setMessages([]);
  }

  useEffect(() => {
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || !conversation || sending) return;

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content, _temp: true }]);

    try {
      const res = await api.post(`/ai/conversations/${conversation._id}/messages`, { content });
      setMessages((prev) => [
        ...prev.filter((m) => !m._temp),
        res.data.userMessage,
        res.data.assistantMessage,
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send();
  }

  const suggestions = language === "ha" ? SUGGESTED_TOPIC_KEYS_HA : SUGGESTED_TOPIC_KEYS_EN;

  return (
    <div className="flex min-h-screen flex-col bg-clay-50">
      <header className="border-b border-clay-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link to="/dashboard" className="text-sm text-sage-600 hover:underline">
            ← {t("dashboard_welcome")}
          </Link>
          <h1 className="font-display text-lg font-semibold text-clay-600">{t("ai_title")}</h1>
          <button
            onClick={startConversation}
            className="text-sm font-medium text-clay-600 hover:underline"
          >
            {t("ai_newConversation")}
          </button>
        </div>
      </header>

      <div className="border-b border-clay-100 bg-clay-50 px-4 py-2 text-center text-xs text-sage-600">
        {t("ai_disclaimer")}
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="mb-6 rounded-2xl bg-white p-5 text-sm text-sage-700 shadow-sm ring-1 ring-clay-100">
            <p className="mb-3">{t("ai_emptyState")}</p>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-500">
              {t("ai_suggestedTopics")}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-clay-50 px-3 py-1 text-xs font-medium text-clay-700 ring-1 ring-clay-200 hover:bg-clay-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={m._id || i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-clay-500 text-white"
                    : m.safetyFlag === "danger_sign"
                    ? "bg-red-50 text-red-800 ring-1 ring-red-200"
                    : "bg-white text-sage-800 ring-1 ring-clay-100"
                }`}
              >
                {m.role === "assistant" && m.safetyFlag === "danger_sign" && (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                    {t("ai_urgentBadge")}
                  </p>
                )}
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-sage-500 shadow-sm ring-1 ring-clay-100">
                {t("ai_thinking")}
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </main>

      <form onSubmit={handleSubmit} className="border-t border-clay-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ai_inputPlaceholder")}
            className="flex-1 rounded-full border border-sage-200 px-4 py-2 text-sm focus:border-sage-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-full bg-clay-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-clay-600 disabled:opacity-50"
          >
            {t("ai_send")}
          </button>
        </div>
      </form>
    </div>
  );
}
