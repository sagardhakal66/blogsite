import Joi from "joi";
import { createError } from "../errors/errors.js";
import { validate } from "../validations/validate.js";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategorys,
} from "../services/category.service.js";

export async function createCategory(req, res) {
  try {
    const { body, user } = req;
    if (user.user_type === "admin") {
      const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
      });
      await validate(body, schema);
      const response = await addCategory(body);
      return res.json({
        message: "Category added",
        data: response,
      });
    }
    throw new Error("Unable to create category");
  } catch (err) {
    createError(err, res);
  }
}

export async function listCategory(req, res) {
  try {
    const { query } = req;

    const response = await getCategorys(query);
    res.json({
      message: "Categories list",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function removeCategory(req, res) {
  try {
    const { params, user } = req;

    if (user.user_type === "admin") {
      const response = await deleteCategory({ _id: params.id });
      return res.json({
        message: "Categories deleted successfully",
        data: response,
      });
    }
    throw new Error("You cannot delete this category");
  } catch (err) {
    createError(err, res);
  }
}
