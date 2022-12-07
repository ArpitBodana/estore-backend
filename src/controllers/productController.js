import { Product } from "../models";
import path from "path";
import { productSchema } from "../validators";
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from "fs";

const productController = {
  async store(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    console.log(req.body);
    const {
      name,
      price,
      rating,
      brand,
      description,
      countInStock,
      numOfReviews,
      category,
      image,
    } = req.body;
    let document;
    try {
      document = await Product.create({
        name,
        price,
        rating,
        brand,
        description,
        countInStock,
        numOfReviews,
        category,
        image,
      });
    } catch (error) {
      console.log("save error");
      return next(error);
    }
    res.status(201).json(document);
  },
  async index(req, res, next) {
    let docs;
    try {
      docs = await Product.find().select("-updatedAt -__v");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(docs);
  },

  async show(req, res, next) {
    const { id } = req.params;
    let document;
    try {
      document = await Product.findOne({ _id: id }).select("-updatedAt -__v");

      if (!document) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(document);
  },

  async showByName(req, res, next) {
    const { id } = req.params;
    let doc;
    try {
      doc = await Product.findOne({ name: id }).select("-updatedAt -__v");
      if (!doc) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(doc);
  },

  async update(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) {
      if (req.file) {
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
      }

      return next(error);
    }

    const {
      name,
      price,
      rating,
      brand,
      description,
      countInStock,
      numOfReviews,
    } = req.body;

    let doc;
    try {
      doc = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          price,
          rating,
          brand,
          description,
          countInStock,
          numOfReviews,
          ...(req.body.image && { image: req.body.image }),
        },
        { new: true }
      );
    } catch (error) {
      return next(err);
    }
    res.status(201).json(doc);
  },

  async destroy(req, res, next) {
    let doc;
    try {
      doc = await Product.findOneAndRemove({ _id: req.params.id });

      if (!doc) {
        return next(new Error("nothing to delete"));
      }
      const imagePath = doc._doc.image;
      fs.unlink(`${appRoot}/${imagePath}`, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
      });
      res.json(doc);
    } catch (error) {
      return next(error);
    }
  },

  async getCategories(req, res, next) {
    const categories = await Product.find().distinct("category");
    res.json(categories);
  },

  async searchProduct(req, res, next) {
    const { query } = req;
    let PAGE_SIZE = 3;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const brand = query.brand || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            $gte: Number(rating),
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  },
};

export default productController;
