const HealthArticle = require("../models/HealthArticle");
const HealthCategory = require("../models/HealthCategory");

async function listCategories(req, res) {
  const categories = await HealthCategory.find().sort({ order: 1 });
  res.json({ categories });
}

async function listArticles(req, res) {
  const { category, q } = req.query;
  const filter = { status: "published" };

  if (category) {
    const cat = await HealthCategory.findOne({ slug: category });
    if (!cat) return res.json({ articles: [] });
    filter.category = cat._id;
  }
  if (q) {
    filter.$text = { $search: q };
  }

  const articles = await HealthArticle.find(filter).populate("category", "slug name").sort({ createdAt: -1 });
  res.json({ articles });
}

async function getArticle(req, res) {
  const article = await HealthArticle.findOne({ _id: req.params.id, status: "published" }).populate(
    "category",
    "slug name"
  );
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ article });
}

async function adminListArticles(req, res) {
  const articles = await HealthArticle.find().populate("category", "slug name").sort({ createdAt: -1 });
  res.json({ articles });
}

async function createArticle(req, res) {
  try {
    const article = await HealthArticle.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ article });
  } catch (err) {
    res.status(400).json({ message: "Could not create article", error: err.message });
  }
}

async function updateArticle(req, res) {
  try {
    const article = await HealthArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ article });
  } catch (err) {
    res.status(400).json({ message: "Could not update article", error: err.message });
  }
}

async function deleteArticle(req, res) {
  const article = await HealthArticle.findByIdAndDelete(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Article deleted" });
}

module.exports = {
  listCategories,
  listArticles,
  getArticle,
  adminListArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
