import { JWT_SECTRET } from "../config";
import jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, expiry = "180000s", secret = JWT_SECTRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(token, secret = JWT_SECTRET) {
    return jwt.verify(token, secret);
  }
}

export default JwtService;