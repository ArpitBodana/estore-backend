class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    (this.status = status), (this.message = message);
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(401, message);
  }

  static serverError(message = "Internal Server Error ") {
    return new CustomErrorHandler(500, message);
  }

  static notFound(message = "404 Not Found") {
    return new CustomErrorHandler(404, message);
  }
  static wrongCredentials(message = "Username/Password wrong!!") {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorized(message = "Invalid Token!!") {
    return new CustomErrorHandler(401, message);
  }
  static nonAdmin(message = "You are not an Admin!!") {
    return new CustomErrorHandler(401, message);
  }
}

export default CustomErrorHandler;
