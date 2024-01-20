import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", schema);
