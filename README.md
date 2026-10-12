# MamaCare Connect — Phases 1–3

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
- Health education library: the 11 fixed categories from the spec
  (Pregnancy, Antenatal, Maternal Health, Newborn, Child Health,
  Immunization, Child Nutrition, Breastfeeding, Postpartum, Reproductive
  Health, Family Planning, Danger Signs), each with a full bilingual
  starter article, searchable and filterable. Admin endpoints manage
  drafts/publishing so this is a real, extensible library.
- Child Nutrition: 5 "MamaCare Natural Pap Ideas" (classic
  maize/millet/guinea-corn base, plus soy-, groundnut-, crayfish &
  vegetable-, and tigernut/date-enriched variants — reflecting real
  Nigerian complementary-feeding practice) with ingredients, steps, age
  suitability, nutrition benefit and storage advice. Plus 6 affordable
  fruit guides (banana, pawpaw, avocado, orange, mango, watermelon) with
  age-appropriate prep and explicit choking-safety notes. A safety
  banner (no honey under 12 months, no whole nuts/choking hazards,
  introduce allergens one at a time, hygiene, no added sugar/salt) shows
  wherever this content appears, and nothing claims a food alone causes
  weight gain.
- Family Planning: neutral info on 10 methods (natural, barrier,
  hormonal, long-acting, emergency, permanent) — duration, mechanism,
  effectiveness, advantages, side effects, considerations — with no
  method recommended over another, a side-by-side comparison tool, and
  private per-user reminders (a lightweight version; the full Reminders
  & Alarms system in Phase 5 will likely absorb these).

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
education, pap recipes, fruit guides, family planning). Each can also be
run individually — see `backend/package.json`.

## Important notes

- **Hausa translations** (in `frontend/src/i18n/translations.js` and in
  every seed file under `backend/utils/seed*.js`) were AI-drafted. Since
  this is health content, please have a Hausa speaker — and ideally a
  health professional for the family-planning wording — review it before
  real users see it. This matters more than usual for a health app.
- **Password reset** currently returns the reset token directly in the
  API response (`devOnlyResetToken`) so you can test the flow without an
  email provider. Wire up an email or SMS service (Nodemailer, Twilio,
  Termii, etc.) in `backend/controllers/authController.js` and remove
  that field before real users touch this.
- Admin accounts can't be created through public signup by design (per
  the spec). For now, create one directly in MongoDB (e.g. via
  `mongosh`) with `userType: "admin"` and a bcrypt-hashed password — a
  proper admin-creation flow arrives with the Admin Dashboard phase.
- Family planning effectiveness figures are widely published typical-use
  ranges (WHO/CDC-style contraceptive tables), shown neutrally for
  comparison — not a recommendation of which method to use.

## Roadmap (matches the original spec's sections)

1. ✅ Foundation — auth, roles, bilingual landing page, dashboard shell
2. ✅ Pregnancy tracking (LMP/EDD calculator) + child profiles +
   immunization schedule
3. ✅ Health education library + child nutrition (pap recipes, fruit
   guides) + family planning content, comparison tool and private
   reminders
4. MamaCare AI educational assistant (bilingual, grounded, non-diagnostic)
5. Reminders/alarms (24-hours-before default, snooze/dismiss, PWA
   notifications) — will likely fold in the Phase 3 family-planning
   reminders
6. Clinic Dashboard (appointments, pilot feedback)
7. Admin Dashboard (analytics, content management, vaccine schedule config)

Tell me when you're ready for Phase 4 and I'll build straight on top of
this — nothing here gets thrown away.
