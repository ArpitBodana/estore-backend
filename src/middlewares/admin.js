import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtServices";

const isAdmin = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }

  const token = authHeader.split(" ")[1];
  try {
    const { _id, role } = await JwtService.verify(token);
    const user = {
      _id,
      role,
    };
    if (user.role === "admin") {
      req.user = user;
      next();
    } else {
      return next(CustomErrorHandler.nonAdmin());
    }
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized());
  }
};

export default isAdmin;
