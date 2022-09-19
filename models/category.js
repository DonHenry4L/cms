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

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.add(UniqueObjectId);

module.exports = mongoose.model("Category", categorySchema);
