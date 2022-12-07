import { Order } from "../models";

const orderController = {
  async storeOrder(req, res, next) {
    try {
      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const order = await newOrder.save();
      res.status(201).json({ message: "New Order Created", order });
    } catch (error) {
      return next(error);
    }
  },

  async orderGet(req, res, next) {
    const { id } = req.params;
    let document;
    try {
      document = await Order.findOne({ _id: id }).select("-updatedAt -__v");
      if (!document) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (error) {
      return next(error);
    }
    res.json(document);
  },

  async orderPay(req, res, next) {
    const { id } = req.params;
    let document;
    try {
      document = await Order.findOne({ _id: id }).select("-updatedAt -__v");
      if (!document) {
        return next(CustomErrorHandler.notFound());
      } else {
        document.isPaid = true;
        document.paidAt = Date.now();
        document.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
      }
    } catch (error) {
      return next(error);
    }
    const updateDoc = await document.save();
    res.json({ message: "Order Paid ", order: updateDoc });
  },

  async getMineOrders(req, res, next) {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  },
};

export default orderController;
