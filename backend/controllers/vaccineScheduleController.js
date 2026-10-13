const VaccineSchedule = require("../models/VaccineSchedule");

async function list(req, res) {
  const entries = await VaccineSchedule.find({ isActive: true }).sort({ order: 1 });
  res.json({ schedule: entries });
}

async function create(req, res) {
  try {
    const entry = await VaccineSchedule.create(req.body);
    res.status(201).json({ entry });
  } catch (err) {
    res.status(400).json({ message: "Could not create schedule entry", error: err.message });
  }
}

async function update(req, res) {
  try {
    const entry = await VaccineSchedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) return res.status(404).json({ message: "Schedule entry not found" });
    res.json({ entry });
  } catch (err) {
    res.status(400).json({ message: "Could not update schedule entry", error: err.message });
  }
}

async function remove(req, res) {
  const entry = await VaccineSchedule.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!entry) return res.status(404).json({ message: "Schedule entry not found" });
  res.json({ message: "Schedule entry deactivated" });
}

module.exports = { list, create, update, remove };
