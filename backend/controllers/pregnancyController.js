const Pregnancy = require("../models/Pregnancy");
const { calculatePregnancy } = require("../utils/pregnancyCalc");

function withCalculations(pregnancyDoc) {
  const calc = calculatePregnancy(pregnancyDoc.lmpDate);
  return {
    id: pregnancyDoc._id,
    status: pregnancyDoc.status,
    notes: pregnancyDoc.notes,
    lmpDate: pregnancyDoc.lmpDate,
    ...calc,
  };
}

// GET /api/pregnancies/mine
async function getMine(req, res) {
  const pregnancy = await Pregnancy.findOne({ user: req.user._id, status: "active" }).sort({
    createdAt: -1,
  });
  if (!pregnancy) return res.json({ pregnancy: null });
  res.json({ pregnancy: withCalculations(pregnancy) });
}

// POST /api/pregnancies
async function createOrUpdate(req, res) {
  try {
    const { lmpDate, notes } = req.body;
    if (!lmpDate) return res.status(400).json({ message: "lmpDate is required" });

    const lmp = new Date(lmpDate);
    if (Number.isNaN(lmp.getTime()) || lmp > new Date()) {
      return res.status(400).json({ message: "lmpDate must be a valid date in the past" });
    }

    let pregnancy = await Pregnancy.findOne({ user: req.user._id, status: "active" });
    if (pregnancy) {
      pregnancy.lmpDate = lmp;
      if (notes !== undefined) pregnancy.notes = notes;
      await pregnancy.save();
    } else {
      pregnancy = await Pregnancy.create({ user: req.user._id, lmpDate: lmp, notes });
    }

    res.status(201).json({ pregnancy: withCalculations(pregnancy) });
  } catch (err) {
    res.status(500).json({ message: "Could not save pregnancy record", error: err.message });
  }
}

// PUT /api/pregnancies/:id/status
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["active", "completed", "ended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const pregnancy = await Pregnancy.findOne({ _id: req.params.id, user: req.user._id });
    if (!pregnancy) return res.status(404).json({ message: "Pregnancy record not found" });

    pregnancy.status = status;
    await pregnancy.save();
    res.json({ pregnancy: withCalculations(pregnancy) });
  } catch (err) {
    res.status(500).json({ message: "Could not update status", error: err.message });
  }
}

module.exports = { getMine, createOrUpdate, updateStatus };
