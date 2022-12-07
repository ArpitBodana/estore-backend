import { PAYPAL_CLIENT_ID } from "../config";
const payController = {
  async payPalKeys(req, res, next) {
    res.json(PAYPAL_CLIENT_ID||'sb')
  },
};

export default payController