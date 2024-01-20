import { createError } from "../errors/errors.js";
import jwt from "jsonwebtoken";

export default async function checkAuthHeader(req, res, next) {
  try {
    const token = req.headers["authorization"];
    console.log("Token >> ", token);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.data) {
      req.user = decoded.data;
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    createError(err, res);
  }
}
