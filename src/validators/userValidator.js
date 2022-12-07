import Joi from "joi";

const registerSchema=Joi.object({
    name: Joi.string().min(3).max(40).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-z0-p]{3,30}$')).required(),
    repeat_password:Joi.ref('password')

})

export default registerSchema;