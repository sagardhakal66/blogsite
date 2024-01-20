import mongoose from "mongoose";

export default function dbCon() {
  try {
    const conn = mongoose.connect(process.env.DB_URL);
    if (conn) {
      console.log("Db connected");
    } else {
      throw new Error("error on db conn");
    }
  } catch (err) {
    console.log("Error on db connection");
  }
}
