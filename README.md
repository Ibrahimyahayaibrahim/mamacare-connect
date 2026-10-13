# MamaCare Connect — Phases 1–4

"Connecting Mothers, Children and Better Health Information."

A real MERN build (MongoDB, Express, React, Node) — not a mockup. Auth,
roles, database-backed features, and bilingual (English/Hausa) content
throughout, built in phases so nothing gets thrown away as it grows.

## What's included so far

**Phase 1 — Foundation**
- User model: name, email, phone, hashed password, preferred language,
  role (`user` / `clinic` / `admin`)
- Signup, login, logout, get/update profile, forgot/reset password
  (token-based)
- JWT auth (`protect` middleware) + role-based access (`allowRoles`)
  middleware — enforced server-side, not just hidden in the UI
- Bilingual landing page (Hero, Challenge, Solution, Features, How It
  Works, Safety, Privacy, Contact) with a language switcher
- Protected dashboard shell

**Phase 2 — Pregnancy, children, immunization**
- Pregnancy tracking: `POST /api/pregnancies` takes an LMP date; week,
  trimester, EDD, days-remaining and progress % are all *derived*
  server-side (`backend/utils/pregnancyCalc.js`) so they can't drift out
  of sync
- Child profiles: user-scoped CRUD (`/api/children`)
- Immunization: `VaccineSchedule` is an admin-editable template seeded
  with Nigeria's official NPI schedule (sourced from the Paediatric
  Association of Nigeria / UNICEF Nigeria, cited in the seed file).
  Adding a child auto-generates real per-child `Immunization` records
  from `dob + ageInDays` — nothing invented. Status (Upcoming/Due
  Today/Completed/Overdue) is computed live.

**Phase 3 — Education, nutrition, family planning**
- Health education library: the 11 fixed categories from the spec, each
  with a full bilingual starter article, searchable and filterable.
  Admin endpoints manage drafts/publishing.
- Child Nutrition: 5 "MamaCare Natural Pap Ideas" (classic
  maize/millet/guinea-corn base, plus soy-, groundnut-, crayfish &
  vegetable-, and tigernut/date-enriched variants) with ingredients,
  steps, age suitability, nutrition benefit and storage advice. Plus 6
  affordable fruit guides with age-appropriate prep and choking-safety
  notes. A safety banner (no honey under 12 months, no whole
  nuts/choking hazards, introduce allergens one at a time, hygiene, no
  added sugar/salt) shows wherever this content appears.
- Family Planning: neutral info on 10 methods (natural, barrier,
  hormonal, long-acting, emergency, permanent) with a side-by-side
  comparison tool and private per-user reminders.

**Phase 4 — MamaCare AI**
- A bilingual (English/Hausa) educational assistant, built to work with
  zero external setup: `backend/utils/aiKnowledgeBase.js` is a
  self-contained, reviewed topic library (one entry per Health Education
  category) with simple keyword matching — no API key, no vector DB, no
  "Coming Soon."
- Two safety checks run **before** anything else and can't be bypassed:
  1. **Danger-sign detection** — if the message mentions a danger sign
     (bleeding, convulsions, can't breathe, unconscious, etc.) the reply
     is always the urgent-care message, in English or Hausa.
  2. **Diagnosis/prescription guard** — "do I have X", "what should I
     take", "what dose", etc. always redirect to a healthcare provider;
     the AI never answers these.
- Every reply ends with (and the chat UI always shows) the required
  disclaimer: *"MamaCare AI provides educational support and does not
  replace professional healthcare advice."*
- Conversations and messages are saved per user (`AiConversation`,
  `AiMessage`) so history persists, each flagged with which topic it
  matched and whether a safety guardrail fired.
- Frontend: a chat page at `/ai` with suggested topic chips, a persistent
  disclaimer banner, and a distinct visual treatment for danger-sign
  replies.
- Architecture note: `generateReply()` in `aiKnowledgeBase.js` is the
  only place a real LLM would plug in later (Claude or otherwise) — swap
  its body for an API call behind the same two safety checks, and
  nothing else in the app needs to change.

## Running it locally (Windows / PowerShell)

**Backend**
```powershell
cd backend
copy .env.example .env
# edit .env: set MONGO_URI (a local MongoDB or a free MongoDB Atlas cluster)
npm install
npm run seed:all
npm run dev
```

**Frontend** (in a second terminal)
```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

`npm run seed:all` runs every seed script (vaccine schedule, health
education, pap recipes, fruit guides, family planning). MamaCare AI
needs no seeding — its content lives in `aiKnowledgeBase.js` directly.

## Important notes

- **Hausa translations** (in `frontend/src/i18n/translations.js`, every
  seed file under `backend/utils/seed*.js`, and `aiKnowledgeBase.js`)
  were AI-drafted. Since this is health content, please have a Hausa
  speaker — and ideally a health professional for the family-planning
  and AI wording — review it before real users see it.
- **Password reset** currently returns the reset token directly in the
  API response (`devOnlyResetToken`) so you can test the flow without an
  email provider. Wire up an email or SMS service (Nodemailer, Twilio,
  Termii, etc.) in `backend/controllers/authController.js` and remove
  that field before real users touch this.
- Admin accounts can't be created through public signup by design. For
  now, create one directly in MongoDB with `userType: "admin"` and a
  bcrypt-hashed password — a proper admin-creation flow arrives with the
  Admin Dashboard phase.
- MamaCare AI only ever answers from its fixed, reviewed topic list — it
  will never improvise medical content outside that library, by design.

## Roadmap (matches the original spec's sections)

1. ✅ Foundation — auth, roles, bilingual landing page, dashboard shell
2. ✅ Pregnancy tracking + child profiles + immunization schedule
3. ✅ Health education library + child nutrition + family planning
4. ✅ MamaCare AI educational assistant (bilingual, grounded, non-diagnostic)
5. Reminders/alarms (24-hours-before default, snooze/dismiss, PWA
   notifications) — will likely fold in the Phase 3 family-planning
   reminders
6. Clinic Dashboard (appointments, pilot feedback)
7. Admin Dashboard (analytics, content management, vaccine schedule config)

Tell me when you're ready for Phase 5 and I'll build straight on top of
this — nothing here gets thrown away.
