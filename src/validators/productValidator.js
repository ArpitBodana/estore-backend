import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  price: Joi.number().required(),
  rating: Joi.number().required(),
  brand: Joi.string().min(3).max(50).required(),
  description: Joi.string().required(),
  countInStock: Joi.number().required(),
  numOfReviews: Joi.number().required(),
  category: Joi.string().required(),
  image: Joi.string(),
});

export default productSchema;
