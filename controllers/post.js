const cloudinary = require("../cloud");
const expressAsyncHandler = require("express-async-handler");
import slugify from "slugify";
const { sendError } = require("../utils/helper");
const Post = require("../models/post");
import User from "../models/user";
const Category = require("../models/category");

export const createPost = expressAsyncHandler(async (req, res) => {
  try {
    // console.log(req.body);
    const { title, content, categories } = req.body;
    // check if title is taken
    const alreadyExist = await Post.findOne({
      slug: slugify(title.toLowerCase()),
    });
    if (alreadyExist) return res.json({ error: "Title is taken" });

    // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({
        name: categories[i],
      }).exec((err, data) => {
        if (err) return console.log(err);

        if (data) {
          ids.push(data._id);
          console.log("FOUND CATEGORY IN FOR LOOP => ", data);
        }
      });
    }

    // save post
    setTimeout(async () => {
      try {
        const post = await new Post({
          ...req.body,
          slug: slugify(title),
          categories: ids,
          postedBy: req.user._id,
        }).save();

        // push the post _id to user's posts []
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { posts: post._id },
        });

        return res.json(post);
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  }

  // const { file, body } = req;

  // const { title, content, categories } = body;
  // console.log(req.body);

  // // check if title is taken
  // const alreadyExist = await Post.findOne({
  //   slug: slugify(title.toLowerCase()),
  // });
  // if (alreadyExist) return sendError(res, "This Post Title already exists!");

  // // get category ids based on category name
  // let ids = [];
  // for (let i = 0; i < categories.length; i++) {
  //   Category.findOne({
  //     name: categories[i],
  //   }).exec((error, data) => {
  //     if (error) return sendError(res, "Error occurred in Category");
  //     ids.push(data._id);
  //   });
  // }

  // const newPost = await new Post({
  //   ...req.body,
  //   slug: slugify(title),
  //   categories: ids,
  //   postedBy: req.user._id,
  // });

  // // uploading poster
  // if (file) {
  //   const {
  //     secure_url: url,
  //     public_id,
  //     responsive_breakpoints,
  //   } = await cloudinary.uploader.upload(file.path, {
  //     transformation: {
  //       width: 1280,
  //       height: 720,
  //     },
  //     responsive_breakpoints: {
  //       create_derived: true,
  //       max_width: 640,
  //       max_images: 3,
  //     },
  //   });

  //   const finalPoster = { url, public_id, responsive: [] };

  //   const { breakpoints } = responsive_breakpoints[0];
  //   if (breakpoints.length) {
  //     for (let imgObj of breakpoints) {
  //       const { secure_url } = imgObj;
  //       finalPoster.responsive.push(secure_url);
  //     }
  //   }
  //   newPost.poster = finalPoster;
  // }

  // await newPost.save();

  // res.status(201).json({
  //   post: {
  //     id: newPost._id,
  //     categories: ids,
  //     title,
  //   },
  // });
});

// exports.createComment = async (req, res) => {
//   try {
//     try {
//       const { postId } = req.params;
//       const { comment } = req.body;
//       let newComment = await new Comment({
//         content: comment,
//         postedBy: req.user._id,
//         postId,
//       }).save();
//       newComment = await newComment.populate("postedBy", "name");
//       res.json(newComment);
//     } catch (err) {
//       console.log(err);
//     }
//   } catch (error) {}
// };
