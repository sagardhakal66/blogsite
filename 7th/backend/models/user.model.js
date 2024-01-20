import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    address: String,
    email: String,
    password: String,
    user_type: {
      type: String,
      default: "user",
    },
    contact: String,
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", schema);
