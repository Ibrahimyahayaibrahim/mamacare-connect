const MS_PER_DAY = 1000 * 60 * 60 * 24;
const FULL_TERM_DAYS = 280; // 40 weeks, Naegele's rule from LMP

// Everything the app shows about a pregnancy is derived here from the
// LMP date alone, so week/trimester/EDD/progress can never drift apart
// or be edited into contradicting each other.
function calculatePregnancy(lmpDate) {
  const lmp = new Date(lmpDate);
  lmp.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysPregnant = Math.floor((today - lmp) / MS_PER_DAY);
  const edd = new Date(lmp.getTime() + FULL_TERM_DAYS * MS_PER_DAY);

  const week = Math.max(0, Math.floor(daysPregnant / 7));
  const dayOfWeek = Math.max(0, daysPregnant % 7);

  let trimester = 1;
  if (week >= 28) trimester = 3;
  else if (week >= 13) trimester = 2;

  const daysRemaining = Math.max(0, Math.ceil((edd - today) / MS_PER_DAY));
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysPregnant / FULL_TERM_DAYS) * 100)));

  return {
    lmpDate: lmp,
    eddDate: edd,
    week,
    dayOfWeek,
    trimester,
    daysPregnant: Math.max(0, daysPregnant),
    daysRemaining,
    progressPercent,
    isPastDueDate: today > edd,
  };
}

module.exports = { calculatePregnancy };
