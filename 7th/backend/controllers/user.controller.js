import Joi from "joi";
import { createError } from "../errors/errors.js";
import {
  addUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { validate } from "../validations/validate.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/hash.utils.js";

export async function createUser(req, res) {
  try {
    const { body } = req;
    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      contact: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    await validate(body, schema);
    const isUserExist = await getUser({ email: body.email });
    if (isUserExist) {
      throw new Error("User already exist with this email");
    }
    const password = await hashPassword(body.password);
    const response = await addUser({ ...body, password });
    res.json({
      message: "user created successfully",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function modifyUser(req, res) {
  try {
    const { body, params } = req;

    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      contact: Joi.string().required(),
    });

    await validate(body, schema);
    const response = await updateUser({ _id: params.userid }, body);

    return res.json({
      message: "User updated successfully",
      data: response,
    });
  } catch (err) {
    console.log(err);
    createError(err, res);
  }
}

export async function userEnableDisable(req, res) {
  try {
    const { body, params } = req;

    const schema = Joi.object({
      is_active: Joi.boolean().required(),
    });
    await validate(body, schema);
    const response = await updateUser({ _id: params.userid }, body);

    res.json({
      message: "User updated successfully",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function removeUser(req, res) {
  try {
    const { body } = req;
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    await validate(body, schema);
    const response = await addUser(body);
    res.json({
      message: "user created successfully",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function loginUser(req, res) {
  try {
    const { body } = req;
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    await validate(body, schema);
    const user = await getUser({ email: body.email });
    if (!user) {
      throw new Error("User not found with this email.");
    }
    const isPasswordMatched = await comparePassword(
      body.password,
      user.password
    );
    if (!isPasswordMatched) {
      throw new Error("Password not matched");
    }
    const token = await generateToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    return res.json({
      message: "Loggedin",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    createError(err, res);
  }
}

export async function listUsers(req, res) {
  try {
    if (req?.user?.user_type === "admin") {
      const users = await getUsers(req.query);
      return res.json({
        message: "User lists",
        data: users,
      });
    }
    throw new Error("User should be admin");
  } catch (err) {
    createError(err, res);
  }
}
export async function getAuthors(req, res) {
  try {
    const users = await getUsers(req.query);
    return res.json({
      message: "User lists",
      data: users,
    });
  } catch (err) {
    createError(err, res);
  }
}
export async function changePassword(req, res) {
  try {
    const { body, params, user } = req;
    const schema = Joi.object({
      password: Joi.string().required(),
      new_password: Joi.string().required(),
    });

    await validate(body, schema);

    const user_ = await getUser({ _id: user.id });

    if (!user_) {
      throw new Error("User not found");
    }

    const isPasswordMatched = await comparePassword(
      body.password,
      user_.password
    );

    if (!isPasswordMatched) {
      throw new Error("Old password not matched");
    }

    const password = await hashPassword(body.new_password);

    const response = await updateUser({ _id: user.id }, { password });
    if (!response) throw new Error("Unable to change password ");
    return res.json({
      message: "Password changed successfully",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}
