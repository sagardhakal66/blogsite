import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    contact: String,
    address: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Enquiry", schema);
