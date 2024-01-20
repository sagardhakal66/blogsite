import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    tags: [String],
    short_description: {
      type: String,
      default: "",
      required: true,
    },
    description: String,
    author: {
      type: String,
      ref: "User",
    },
    category: {
      type: String,
      ref: "Category",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", schema);
