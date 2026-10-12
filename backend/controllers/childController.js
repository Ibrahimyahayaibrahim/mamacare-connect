const Child = require("../models/Child");
const Immunization = require("../models/Immunization");
const { generateImmunizationsForChild } = require("./immunizationController");

// GET /api/children
async function list(req, res) {
  const children = await Child.find({ user: req.user._id }).sort({ dob: -1 });
  res.json({ children });
}

// GET /api/children/:id
async function getOne(req, res) {
  const child = await Child.findOne({ _id: req.params.id, user: req.user._id });
  if (!child) return res.status(404).json({ message: "Child not found" });
  res.json({ child });
}

// POST /api/children
async function create(req, res) {
  try {
    const { name, dob, sex, notes } = req.body;
    if (!name || !dob || !sex) {
      return res.status(400).json({ message: "name, dob and sex are required" });
    }

    const child = await Child.create({ user: req.user._id, name, dob, sex, notes });
    await generateImmunizationsForChild(child);

    res.status(201).json({ child });
  } catch (err) {
    res.status(500).json({ message: "Could not create child profile", error: err.message });
  }
}

// PUT /api/children/:id
async function update(req, res) {
  try {
    const child = await Child.findOne({ _id: req.params.id, user: req.user._id });
    if (!child) return res.status(404).json({ message: "Child not found" });

    const { name, notes } = req.body;
    // dob and sex are intentionally not editable here: changing dob would
    // silently desync every already-generated immunization date. A future
    // "correct date of birth" flow should explicitly regenerate them.
    if (name) child.name = name;
    if (notes !== undefined) child.notes = notes;
    await child.save();

    res.json({ child });
  } catch (err) {
    res.status(500).json({ message: "Could not update child profile", error: err.message });
  }
}

// DELETE /api/children/:id
async function remove(req, res) {
  const child = await Child.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!child) return res.status(404).json({ message: "Child not found" });
  await Immunization.deleteMany({ child: child._id });
  res.json({ message: "Child profile deleted" });
}

module.exports = { list, getOne, create, update, remove };
