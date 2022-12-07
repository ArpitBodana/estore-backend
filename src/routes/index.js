import express from "express";
import userController from "../controllers/auth/userController";
import {
  productController,
  orderController,
  payController,
} from "../controllers";
import { isAuth, isAdmin } from "../middlewares";
import adminController from "../controllers/auth/adminController";

const router = express.Router();

router.post("/register", userController.register);
router.post("/signin", userController.signin);
router.put("/users/profile", [isAuth], userController.updateProfile);
router.get("/products", productController.index);
router.get("/product/:id", productController.show);
router.get("/products/categories", productController.getCategories);
router.get("/products/search", productController.searchProduct);
router.post("/order", [isAuth], orderController.storeOrder);
router.get("/order/mine", [isAuth], orderController.getMineOrders);
router.get("/order/:id", [isAuth], orderController.orderGet);
router.put("/order/:id/pay", orderController.orderPay);
router.get("/keys/paypal", payController.payPalKeys);
router.get("/admin", [isAdmin], adminController.getAdminData);
router.get("/admin/user/:id", [isAdmin], adminController.getUserData);
router.put("/admin/user/:id", [isAdmin], adminController.updateUserData);
router.delete("/admin/user/:id", [isAdmin], adminController.deleteUserData);
router.put("/admin/product/:id", [isAdmin], productController.update);
router.delete("/admin/product/:id", [isAdmin], productController.destroy);
router.post("/admin/product", [isAdmin], productController.store);

export default router;
