import Joi from "joi";
import { createError } from "../errors/errors.js";
import {
  addBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  getLimitedBlogs,
  updateBlog,
} from "../services/blog.service.js";
import { validate } from "../validations/validate.js";
import { addEnquiry, getEnquiries } from "../services/enquiry.service.js";
import { checkFileValidation } from "../config/utils.js";

export async function postBlog(req, res) {
  try {
    const { user } = req;
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      short_description: Joi.string().required(),
      category: Joi.string().required().invalid("undefined"),
      file: Joi.string().optional(),
      tags: Joi.string().required(),
    });
    await validate(req.body, schema);
    if (req.file) {
      if (checkFileValidation(req.file.mimetype))
        throw new Error("Image should be png, jpeg, jpg, svg only");
      const payload = {
        ...req.body,
        isActive: user.user_type === "admin" ? true : false,
        author: user.id,
        tags: req.body?.tags?.split(","),
        image: req.file?.filename,
      };

      const response = await addBlog(payload);
      if (response) {
        return res.json({
          message: "Blog posted successfully",
          data: response,
        });
      }
      throw new Error("Invalid data");
    }
    throw new Error("Please upload a file");
  } catch (err) {
    createError(err, res);
  }
}

export async function modifyBlog(req, res) {
  try {
    const { user } = req;
    if (req.body.title && req.body.description && req.body.category) {
      let payload = {
        ...req.body,
        tags: req.body?.tags?.split(","),
      };

      if (req.file) {
        payload.image = req.file?.filename;
      }

      const response = await updateBlog({ _id: req.params.id }, payload);
      return res.json({
        message: "Blog updated successfully",
        data: response,
      });
    }
    throw new Error("Invalid data");
  } catch (err) {
    console.log(err);
    createError(err, res);
  }
}

export async function listBlogs(req, res) {
  try {
    const response = await getBlogs(req.query);
    res.json({
      message: "Blog listing",
      data: response,
    });
  } catch (err) {
    console.log(err);
    createError(err, res);
  }
}

export async function singleBlog(req, res) {
  try {
    const response = await getBlog({ _id: req.params.id });
    const related = await getLimitedBlogs({ _id: { $ne: req.params.id } }, 5);
    if (response) {
      return res.json({
        message: "Single blog",
        data: {
          details: response,
          related: related,
        },
      });
    }
    throw new Error("Blog not found.");
  } catch (err) {
    console.log(err);
    createError(err, res);
  }
}

export async function removeBlog(req, res) {
  try {
    const response = await deleteBlog({ _id: req.params.id });
    if (response) {
      return res.json({
        message: "Deleted Successfully",
        data: response,
      });
    }
    throw new Error("Blog not found.");
  } catch (err) {
    createError(err, res);
  }
}

export async function enableDisableBlog(req, res) {
  try {
    const schema = Joi.object({
      isActive: Joi.boolean().optional(),
    });
    await validate(req.body, schema);
    const response = await updateBlog(
      { _id: req.params.id },
      { isActive: req.body.isActive }
    );
    if (response) {
      res.json({
        message:
          req.body.isActive === true
            ? "Enable successfully"
            : "Disable Successfully",
        data: response,
      });
    }
    throw new Error("Blog not found.");
  } catch (err) {
    createError(err, res);
  }
}

export async function postEnquiry(req, res) {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      message: Joi.string().required(),
      contact: Joi.string().required(),
    });
    await validate(req.body, schema);
    const response = await addEnquiry(req.body);
    if (!response) {
      throw new Error("Error on saving enquiry ");
    }
    return res.json({
      message: "Enquiry posted",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function listEnquiry(req, res) {
  try {
    const response = await getEnquiries({});
    if (!response) {
      throw new Error("Error on saving enquiry ");
    }
    return res.json({
      message: "Enquiry lists",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}

export async function searchBlogs(req, res) {
  try {
    const { query } = req;
    if (!query.q) {
      throw new Error("Query required");
    }

    const payload = {
      $or: [
        { title: { $regex: ".*" + query.q + ".*", $options: "i" } },
        { description: { $regex: ".*" + query.q + ".*", $options: "i" } },
      ],
    };

    const response = await getBlogs(payload);

    return res.json({
      message: "search data",
      data: response,
    });
  } catch (err) {
    createError(err, res);
  }
}
