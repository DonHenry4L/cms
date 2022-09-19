const expressAsyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const Comment = require("../models/comment");
const Movie = require("../models/movie");
const { sendError, getAverageComments } = require("../utils/helper");

// create Comments
exports.createComment = expressAsyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  // console.log(JSON.stringify(req.body));

  //   verify user before comment
  if (!req.user.isVerified)
    return sendError(res, "Please verify your email first!");
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie!");

  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "Movie not found!", 404);

  //   create and update new comment
  const newComment = new Comment({
    user: userId,
    parentMovie: movie._id,
    content,
  });

  // updating Comment for movie.
  movie.comments.push(newComment._id);
  await movie.save();

  // save new comment
  await newComment.save();

  const comments = await getAverageComments(movie._id);

  res.json({ message: "New comment added!!", comments });
});

// fetch all comments
exports.getComment = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.find({}).sort({ createdAt: -1 });
  res.json(comments);
});

// fetch single comment by id
exports.getSingleComment = expressAsyncHandler(async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!");

  const movie = await Movie.findById(movieId)
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .select("comments title");

  const comments = movie.comments.map((c) => {
    const { user, content, _id: commentID } = c;
    const { name, _id: userId } = user;
    return {
      id: commentID,
      user: {
        id: userId,
        name,
      },
      content,
    };
  });
  // new Date();

  res.json({ comments });
});

// update comment
exports.updateComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { description } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) return sendError(res, "Invalid Comment ID!");

  const comment = await Comment.findByIdAndUpdate({
    user: userId,
    _id: commentId,
  });
  if (!comment) return sendError(res, "Comment not found!", 404);

  comment.description = description;

  await comment.save();

  res.json({ message: "Your comment has been updated.", comment });
});

// delete comment
exports.deleteComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) return sendError(res, "Invalid comment ID!");

  const comment = await Comment.findOne({ user: userId, _id: commentId });

  if (!comment) return sendError(res, "Invalid request, comment not found!");

  await Comment.findByIdAndDelete(commentId);

  res.json({ message: "Comment removed successfully." });
});
