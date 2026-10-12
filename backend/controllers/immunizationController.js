const Immunization = require("../models/Immunization");
const VaccineSchedule = require("../models/VaccineSchedule");
const Child = require("../models/Child");

// Creates one Immunization doc per active VaccineSchedule entry for a
// newly-added child. Dates always come from schedule.ageInDays + the
// child's real DOB - never invented, never hand-typed.
async function generateImmunizationsForChild(child) {
  const scheduleEntries = await VaccineSchedule.find({ isActive: true }).sort({ order: 1 });
  const docs = scheduleEntries.map((entry) => {
    const scheduledDate = new Date(child.dob);
    scheduledDate.setDate(scheduledDate.getDate() + entry.ageInDays);
    return {
      child: child._id,
      scheduleRef: entry._id,
      vaccineName: entry.vaccineName,
      milestoneLabel: entry.milestoneLabel,
      scheduledDate,
    };
  });
  if (docs.length) await Immunization.insertMany(docs);
}

async function assertOwnsChild(childId, userId) {
  const child = await Child.findOne({ _id: childId, user: userId });
  return child;
}

// GET /api/children/:childId/immunizations
async function listForChild(req, res) {
  try {
    const child = await assertOwnsChild(req.params.childId, req.user._id);
    if (!child) return res.status(404).json({ message: "Child not found" });

    const records = await Immunization.find({ child: child._id }).sort({ scheduledDate: 1 });
    res.json({ immunizations: records.map((r) => r.toSafeObject()) });
  } catch (err) {
    res.status(500).json({ message: "Could not load immunizations", error: err.message });
  }
}

// PUT /api/children/:childId/immunizations/:id/complete
async function markComplete(req, res) {
  try {
    const child = await assertOwnsChild(req.params.childId, req.user._id);
    if (!child) return res.status(404).json({ message: "Child not found" });

    const record = await Immunization.findOne({ _id: req.params.id, child: child._id });
    if (!record) return res.status(404).json({ message: "Immunization record not found" });

    const { completedDate } = req.body;
    record.completedDate = completedDate ? new Date(completedDate) : new Date();
    await record.save();
    res.json({ immunization: record.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Could not update immunization", error: err.message });
  }
}

// PUT /api/children/:childId/immunizations/:id/undo
async function undoComplete(req, res) {
  try {
    const child = await assertOwnsChild(req.params.childId, req.user._id);
    if (!child) return res.status(404).json({ message: "Child not found" });

    const record = await Immunization.findOne({ _id: req.params.id, child: child._id });
    if (!record) return res.status(404).json({ message: "Immunization record not found" });

    record.completedDate = null;
    await record.save();
    res.json({ immunization: record.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Could not update immunization", error: err.message });
  }
}

module.exports = { generateImmunizationsForChild, listForChild, markComplete, undoComplete };
