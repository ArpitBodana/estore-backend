import { User } from "../../models/";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { registerSchema } from "../../validators";
import bcrypt from "bcrypt";
import Joi from "joi";
import JwtService from "../../services/JwtServices";

const userController = {
  async register(req, res, next) {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(CustomErrorHandler.alreadyExist("Email is already taken"));
      }
    } catch (error) {
      return next(error);
    }
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const { name, email, passwod } = req.body;
    const user = new User({
      name,
      email,
      password: hashedpassword,
    });

    try {
      const result = await user.save();
    } catch (err) {
      return next(err);
    }

    res.json({ message: "user registered !!" });
  },

  async signin(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      const { _id, email, role, name } = user;
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      res.json({_id, name, email, role,access_token});
    } catch (error) {
      return next(error);
    }
  },

  async updateProfile(req,res,next){
    const user= await User.findById(req.user._id);
    if(user){
      user.name=req.body.name||user.name;
      user.email=req.body.email||user.email;
      if(req.body.password){
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        user.password=hashedpassword
      }

      const updateUser=await user.save();
      const access_token = JwtService.sign({ _id: updateUser._id, role: updateUser.role });
      res.json({
        _id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        role:updateUser.role,
        access_token,

      })
    }else{
      res.status(401).json({message:"User Not Found!!"})
    }
  },

};

export default userController;
