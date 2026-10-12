const express = require("express");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  listCategories,
  listArticles,
  getArticle,
  adminListArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/healthEducationController");

const router = express.Router();

router.use(protect);

router.get("/categories", listCategories);
router.get("/articles", listArticles);
router.get("/articles/:id", getArticle);

router.get("/admin/articles", allowRoles("admin"), adminListArticles);
router.post("/admin/articles", allowRoles("admin"), createArticle);
router.put("/admin/articles/:id", allowRoles("admin"), updateArticle);
router.delete("/admin/articles/:id", allowRoles("admin"), deleteArticle);

module.exports = router;
