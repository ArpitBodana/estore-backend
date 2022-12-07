import { User, Order, Product } from "../../models/";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const adminController = {
  async getAdminData(req, res, next) {
    let users, products, orders;
    try {
      users = await User.find().select("-password");
      products = await Product.find().select("-updatedAt -__v");
      orders = await Order.find().select("-updatedAt -__v");
    } catch (error) {
      return next(error);
    }

    res.json({ users, products, orders });
  },

  async getUserData(req, res, next) {
    const { id } = req.params;
    let document;
    try {
      document = await User.findOne({ _id: id }).select("-password");

      if (!document) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(document);
  },

  async updateUserData(req, res, next) {
    const { id } = req.params;
    const { name, email, role } = req.body;
    let document;
    try {
      document = await User.findOne({ _id: id }).select("-password");

      if (!document) {
        return next(CustomErrorHandler.notFound());
      }
      let updateDoc;
      try {
        updateDoc = await User.findOneAndUpdate(
          { _id: id },
          {
            name,
            email,
            role,
          },
          { new: true }
        );
      } catch (error) {
        return next(CustomErrorHandler.serverError());
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json({ message: "User Updated" });
  },
  async deleteUserData(req, res, next) {
    const { id } = req.params;
    let document;
    try {
      document = await User.findOneAndRemove({ _id: id });

      if (!document) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json({ message: "User Deleted" });
  },
};

export default adminController;
