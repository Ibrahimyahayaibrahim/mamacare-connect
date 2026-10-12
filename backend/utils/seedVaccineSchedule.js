// Run once with: node utils/seedVaccineSchedule.js
// Populates VaccineSchedule with Nigeria's National Programme on
// Immunization (NPI) routine schedule. Sourced from the Paediatric
// Association of Nigeria, UNICEF Nigeria's published schedule, and
// cross-checked against a 2024/2025 clinical summary - see README for
// links. Admin can edit/replace these later from the Admin Dashboard;
// nothing here should ever be hand-edited per child.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const VaccineSchedule = require("../models/VaccineSchedule");

const schedule = [
  { vaccineName: "BCG", milestoneLabel: "At birth", ageInDays: 0, order: 1, description: "Protects against tuberculosis." },
  { vaccineName: "OPV0 (Oral Polio)", milestoneLabel: "At birth", ageInDays: 0, order: 2, description: "First oral polio dose." },
  { vaccineName: "Hepatitis B (birth dose)", milestoneLabel: "At birth", ageInDays: 0, order: 3, description: "First hepatitis B dose." },

  { vaccineName: "Pentavalent 1", milestoneLabel: "6 weeks", ageInDays: 42, order: 4, description: "Diphtheria, pertussis, tetanus, hepatitis B, Hib." },
  { vaccineName: "PCV 1", milestoneLabel: "6 weeks", ageInDays: 42, order: 5, description: "Pneumococcal conjugate vaccine, protects against pneumonia." },
  { vaccineName: "OPV1", milestoneLabel: "6 weeks", ageInDays: 42, order: 6, description: "Second oral polio dose." },
  { vaccineName: "IPV1", milestoneLabel: "6 weeks", ageInDays: 42, order: 7, description: "Inactivated polio vaccine, injectable." },
  { vaccineName: "Rotavirus 1", milestoneLabel: "6 weeks", ageInDays: 42, order: 8, description: "Protects against severe diarrhoeal disease." },

  { vaccineName: "Pentavalent 2", milestoneLabel: "10 weeks", ageInDays: 70, order: 9 },
  { vaccineName: "PCV 2", milestoneLabel: "10 weeks", ageInDays: 70, order: 10 },
  { vaccineName: "OPV2", milestoneLabel: "10 weeks", ageInDays: 70, order: 11 },
  { vaccineName: "Rotavirus 2", milestoneLabel: "10 weeks", ageInDays: 70, order: 12 },

  { vaccineName: "Pentavalent 3", milestoneLabel: "14 weeks", ageInDays: 98, order: 13 },
  { vaccineName: "PCV 3", milestoneLabel: "14 weeks", ageInDays: 98, order: 14 },
  { vaccineName: "OPV3", milestoneLabel: "14 weeks", ageInDays: 98, order: 15 },
  { vaccineName: "Rotavirus 3", milestoneLabel: "14 weeks", ageInDays: 98, order: 16 },
  { vaccineName: "IPV2", milestoneLabel: "14 weeks", ageInDays: 98, order: 17 },

  { vaccineName: "Vitamin A (1st dose)", milestoneLabel: "6 months", ageInDays: 182, order: 18 },

  { vaccineName: "Measles 1 (MCV1)", milestoneLabel: "9 months", ageInDays: 273, order: 19 },
  { vaccineName: "Yellow Fever", milestoneLabel: "9 months", ageInDays: 273, order: 20 },

  { vaccineName: "Meningitis (MenA)", milestoneLabel: "12 months", ageInDays: 365, order: 21 },
  { vaccineName: "Vitamin A (2nd dose)", milestoneLabel: "12 months", ageInDays: 365, order: 22 },

  { vaccineName: "Measles 2 (MCV2)", milestoneLabel: "15 months", ageInDays: 456, order: 23 },
];

async function run() {
  await connectDB();
  await VaccineSchedule.deleteMany({});
  await VaccineSchedule.insertMany(schedule);
  console.log(`Seeded ${schedule.length} vaccine schedule entries.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
