const express = require("express");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleCheck");
const {
  listPapRecipes,
  listFruitGuides,
  createPapRecipe,
  updatePapRecipe,
  deletePapRecipe,
  createFruitGuide,
  updateFruitGuide,
  deleteFruitGuide,
} = require("../controllers/childNutritionController");

const router = express.Router();

router.use(protect);

router.get("/pap-recipes", listPapRecipes);
router.get("/fruit-guides", listFruitGuides);

router.post("/pap-recipes", allowRoles("admin"), createPapRecipe);
router.put("/pap-recipes/:id", allowRoles("admin"), updatePapRecipe);
router.delete("/pap-recipes/:id", allowRoles("admin"), deletePapRecipe);

router.post("/fruit-guides", allowRoles("admin"), createFruitGuide);
router.put("/fruit-guides/:id", allowRoles("admin"), updateFruitGuide);
router.delete("/fruit-guides/:id", allowRoles("admin"), deleteFruitGuide);

module.exports = router;
