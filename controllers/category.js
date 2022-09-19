const { isValidObjectId } = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

const { sendError } = require("../utils/helper");
const Category = require("../models/category");
import slugify from "slugify";

//create
// Only Admin can create, delete and update Category
exports.createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    // console.log("saved category", category);
    res.json(category);
  } catch (error) {
    console.log(err);
  }

  // const { name } = req.body;
  // // Check if the Category exists
  // const findCategory = await Category.findOne({ name });
  // if (findCategory) return sendError(res, "This category already exists!");
  // const category = new Category({
  //   name,
  //   slug: slugify(name),
  // });
  // await category.save();
  // res.json(category);
});

//fetch all
exports.categories = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.log(err);
  }
  // const categories = await Category.find()
  //   .sort({ createdAt: "-1" })
  //   .populate("user");

  // if (!categories) {
  //   return sendError(res, "Not Category List!");
  // }
  // res.status(200).send(categories);
});

//fetch a single category
// exports.getCategoryById = expressAsyncHandler(async (req, res) => {
//   const { categoryId } = req.params;

//   if (!isValidObjectId(categoryId)) return sendError(res, "Invalid request!");

//   const category = await Category.findById(categoryId)
//     .populate("user")
//     .sort({ createdAt: "-1" });
//   if (!category)
//     return sendError(res, "Invalid request, category not found!", 404);
//   res.json(category);
// });

//update
exports.updateCategory = expressAsyncHandler(async (req, res) => {
  // try {
  //   const { slug } = req.params;

  //   const { name } = req.body;

  //   const category = await Category.findOneAndUpdate(
  //     { slug },

  //     { name, slug: slugify(name) },
  //     { new: true }
  //   );

  //   res.json(category);
  // } catch (error) {
  //   console.log(error);
  // }
  const { slug } = req.params;
  const { name } = req.body;

  if (!isValidObjectId(slug)) return sendError(res, "Invalid Category ID!");

  const category = await Category.findByIdAndUpdate({ _id: slug });
  if (!category)
    return (
      sendError(res, "Category not found!", 404), { name, slug: slugify(name) }
      // { new: true }
    );

  category.name = name;

  await category.save();

  res.json({ message: "Your category has been updated.", category });
});

//delete category
exports.deleteCategory = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!isValidObjectId(slug)) return sendError(res, "Invalid category ID!");

  const category = await Category.findOne({ _id: slug });

  if (!category)
    return sendError(res, "Invalid request, category not found or Deleted!");

  await Category.findByIdAndDelete(slug);

  res.json({ message: "Category Deleted Successfully" });
});

// exports.deleteCategory = expressAsyncHandler(async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const category = await Category.findByIdAndDelete(slug);

//     res.json({ message: "Category Deleted Successfully", category });
//   } catch (error) {
//     console.log(error);
//     return sendError(res, "Invalid request, category not found or Deleted!");
//   }
// });
