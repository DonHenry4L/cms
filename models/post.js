import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const UniqueObjectId = new Schema({
  _id: {
    type: String,
    default: function () {
      return new ObjectId().toString();
    },
  },
});

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {},
    cate: [{ type: ObjectId, ref: "Category" }],
    published: { type: Boolean, default: true },
    postedBy: { type: ObjectId, ref: "User" },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

postSchema.add(UniqueObjectId);
module.exports = mongoose.model("Post", postSchema);
