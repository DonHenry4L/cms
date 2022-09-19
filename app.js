const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middlewares/error");
require("express-async-errors");
require("dotenv").config();
const cors = require("cors");

require("./db");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const postRouter = require("./routes/post");
const reviewRouter = require("./routes/review");
const commentRouter = require("./routes/comment");
const categoryRouter = require("./routes/category");
const adminRouter = require("./routes/admin");
const { handleNotFound } = require("./utils/helper");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/post", postRouter);
app.use("/api/review", reviewRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);

app.use("/*", handleNotFound);

app.use(errorHandler);

// app.post(
//   "/sign-in",
//   (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.json({
//         error: "invalid email/password!",
//       });
//     next();
//   },
//   (req, res) => {
//     res.send("<h1>Hello I am about page<h1>");
//   }
// );

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("The port is listening on port " + PORT);
});
