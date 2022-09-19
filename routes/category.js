const router = require("express").Router();
const {
  createCategory,
  categories,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { isAuth, isAdmin } = require("../middlewares/auth");

router.post("/category", isAuth, isAdmin, createCategory);
router.get("/categories", categories);
router.delete("/:slug", isAuth, isAdmin, deleteCategory);
router.put("/:slug", isAuth, isAdmin, updateCategory);

module.exports = router;
