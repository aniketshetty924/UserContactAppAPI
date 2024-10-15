const jwt = require("jsonwebtoken");
const Logger = require("../utils/logger.js");
const secreteKey = "contact@123";
const UnauthorizedError = require("../errors/unauthorizedError.js");
const User = require("../components/user/service/user.js");
const NotFoundError = require("../errors/notFoundError.js");

const verifyAdmin = (req, res, next) => {
  try {
    Logger.info("verifying admin started...");
    if (!req.cookies["auth"] && !req.headers["auth"]) {
      throw new UnauthorizedError("Cookie Not Found");
    }

    let token = req.cookies["auth"].split(" ")[2];

    let payload = Payload.verifyToken(token);

    if (!payload.isAdmin) throw new UnauthorizedError("unauthorized access");

    Logger.info("verifying admin ended...");
    Logger.info("next called...");
    next();
  } catch (error) {
    next(error);
  }
};

const verifyStaff = async (req, res, next) => {
  try {
    console.log("verifystaff started");
    if (!req.cookies["auth"] && !req.headers["auth"]) {
      throw new UnauthorizedError("Cookie not found...");
    }
    //token??
    let token = req.cookies["auth"].split(" ")[2];
    let payload = Payload.verifyToken(token);
    console.log("payload...");
    console.log(payload);
    if (payload.isAdmin) {
      throw new UnauthorizedError(
        "Admin cant do this oprations , only staff can do..."
      );
    }
    const userId = parseInt(req.params.userID);
    console.log("userID", userId);
    let user = await User.getStaffByID(userId);
    console.log("user....");
    console.log(user);
    if (!user)
      throw new NotFoundError(
        "User has been already deleted or user does not exists.."
      );
    req.user = user;
    console.log(`payload id --> ${payload.id}`);
    if (userId != payload.id)
      throw new UnauthorizedError(
        "You are not authorized to access this account..."
      );
    Logger.info("verifystaff ended");
    Logger.info("next called");

    next();
  } catch (error) {
    next(error);
  }
};
class Payload {
  constructor(id, isAdmin) {
    this.id = id;
    this.isAdmin = isAdmin;
  }

  static newPayload(id, isAdmin) {
    try {
      return new Payload(id, isAdmin);
    } catch (error) {
      throw error;
    }
  }

  static verifyToken(token) {
    let payload = jwt.verify(token, secreteKey);
    return payload;
  }

  signPayload() {
    try {
      return `Bearer ${jwt.sign(
        {
          id: this.id,
          isAdmin: this.isAdmin,
        },
        secreteKey,
        { expiresIn: "10hr" }
      )}`;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { Payload, verifyAdmin, verifyStaff };
