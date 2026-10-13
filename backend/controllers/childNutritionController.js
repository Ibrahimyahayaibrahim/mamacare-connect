const PapRecipe = require("../models/PapRecipe");
const FruitGuide = require("../models/FruitGuide");

async function listPapRecipes(req, res) {
  const recipes = await PapRecipe.find({ isActive: true }).sort({ order: 1 });
  res.json({ recipes });
}

async function listFruitGuides(req, res) {
  const fruits = await FruitGuide.find({ isActive: true }).sort({ order: 1 });
  res.json({ fruits });
}

async function createPapRecipe(req, res) {
  try {
    const recipe = await PapRecipe.create(req.body);
    res.status(201).json({ recipe });
  } catch (err) {
    res.status(400).json({ message: "Could not create recipe", error: err.message });
  }
}

async function updatePapRecipe(req, res) {
  try {
    const recipe = await PapRecipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ recipe });
  } catch (err) {
    res.status(400).json({ message: "Could not update recipe", error: err.message });
  }
}

async function deletePapRecipe(req, res) {
  const recipe = await PapRecipe.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json({ message: "Recipe deactivated" });
}

async function createFruitGuide(req, res) {
  try {
    const fruit = await FruitGuide.create(req.body);
    res.status(201).json({ fruit });
  } catch (err) {
    res.status(400).json({ message: "Could not create fruit guide", error: err.message });
  }
}

async function updateFruitGuide(req, res) {
  try {
    const fruit = await FruitGuide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!fruit) return res.status(404).json({ message: "Fruit guide not found" });
    res.json({ fruit });
  } catch (err) {
    res.status(400).json({ message: "Could not update fruit guide", error: err.message });
  }
}

async function deleteFruitGuide(req, res) {
  const fruit = await FruitGuide.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!fruit) return res.status(404).json({ message: "Fruit guide not found" });
  res.json({ message: "Fruit guide deactivated" });
}

module.exports = {
  listPapRecipes,
  listFruitGuides,
  createPapRecipe,
  updatePapRecipe,
  deletePapRecipe,
  createFruitGuide,
  updateFruitGuide,
  deleteFruitGuide,
};
