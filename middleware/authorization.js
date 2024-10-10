const jwt = require("jsonwebtoken");
const Logger = require("../utils/logger.js");
const secreteKey = "contact@123";
const UnauthorizedError = require("../errors/unauthorizedError.js");

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

const verifyStaff = (req, res, next) => {
  try {
    console.log("verifystaff started");
    if (!req.cookies["auth"] && !req.headers["auth"]) {
      throw new UnauthorizedError("Cookie not found...");
    }
    //token??
    let token = req.cookies["auth"].split(" ")[2];
    let payload = Payload.verifyToken(token);
    if (payload.isAdmin) {
      throw new UnauthorizedError(
        "Admin cant do this oprations , only staff can do..."
      );
    }
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
