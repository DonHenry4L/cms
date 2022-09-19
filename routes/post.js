const express = require("express");
const { createComment } = require("../controllers/comment");
const { createPost } = require("../controllers/post");
const { isAdmin, isAuth } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
// const { validatePost } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  createPost
);

// Comments
router.post("/comment/:postId", isAuth, createComment);

module.exports = router;
