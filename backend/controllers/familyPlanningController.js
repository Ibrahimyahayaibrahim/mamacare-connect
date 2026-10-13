const FamilyPlanningMethod = require("../models/FamilyPlanningMethod");
const FamilyPlanningReminder = require("../models/FamilyPlanningReminder");

async function listMethods(req, res) {
  const methods = await FamilyPlanningMethod.find({ isActive: true }).sort({ order: 1 });
  res.json({ methods });
}

// GET /api/family-planning/compare?ids=id1,id2,id3
// Never ranks or recommends one method over another; that judgment is
// left to the user and their healthcare provider.
async function compareMethods(req, res) {
  const ids = (req.query.ids || "").split(",").filter(Boolean);
  if (ids.length < 2) {
    return res.status(400).json({ message: "Provide at least two method ids to compare (?ids=a,b)" });
  }
  const methods = await FamilyPlanningMethod.find({ _id: { $in: ids }, isActive: true });
  res.json({ methods });
}

async function createMethod(req, res) {
  try {
    const method = await FamilyPlanningMethod.create(req.body);
    res.status(201).json({ method });
  } catch (err) {
    res.status(400).json({ message: "Could not create method", error: err.message });
  }
}

async function updateMethod(req, res) {
  try {
    const method = await FamilyPlanningMethod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!method) return res.status(404).json({ message: "Method not found" });
    res.json({ method });
  } catch (err) {
    res.status(400).json({ message: "Could not update method", error: err.message });
  }
}

async function deleteMethod(req, res) {
  const method = await FamilyPlanningMethod.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!method) return res.status(404).json({ message: "Method not found" });
  res.json({ message: "Method deactivated" });
}

async function listReminders(req, res) {
  const reminders = await FamilyPlanningReminder.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.json({ reminders });
}

async function createReminder(req, res) {
  try {
    const { label, dueDate, notes } = req.body;
    if (!label || !dueDate) {
      return res.status(400).json({ message: "label and dueDate are required" });
    }
    const reminder = await FamilyPlanningReminder.create({ user: req.user._id, label, dueDate, notes });
    res.status(201).json({ reminder });
  } catch (err) {
    res.status(500).json({ message: "Could not create reminder", error: err.message });
  }
}

async function updateReminder(req, res) {
  const reminder = await FamilyPlanningReminder.findOne({ _id: req.params.id, user: req.user._id });
  if (!reminder) return res.status(404).json({ message: "Reminder not found" });

  const { label, dueDate, notes, isDone } = req.body;
  if (label !== undefined) reminder.label = label;
  if (dueDate !== undefined) reminder.dueDate = dueDate;
  if (notes !== undefined) reminder.notes = notes;
  if (isDone !== undefined) reminder.isDone = isDone;
  await reminder.save();
  res.json({ reminder });
}

async function deleteReminder(req, res) {
  const reminder = await FamilyPlanningReminder.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!reminder) return res.status(404).json({ message: "Reminder not found" });
  res.json({ message: "Reminder deleted" });
}

module.exports = {
  listMethods,
  compareMethods,
  createMethod,
  updateMethod,
  deleteMethod,
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder,
};
