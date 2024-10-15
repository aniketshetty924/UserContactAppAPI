const User = require("../service/user.js");
const BadRequest = require("../../../errors/badRequest.js");
const NotFoundError = require("../../../errors/notFoundError.js");
const Logger = require("../../../utils/logger.js");
const badRequest = require("../../../errors/badRequest.js");

//validation functions
const validateID = (id) => {
  if (typeof id != "number") throw new BadRequest("invalid id type...");
  if (id < 0) throw new BadRequest("id cannot be less than 0!");
};
//create user
//post request
const createUser = async (req, res, next) => {
  try {
    Logger.info("create user called...");
    const { firstName, lastName, username, password } = req.body;
    // console.log(`${firstName} - type :- ${typeof firstName}`);
    // console.log(`${lastName} - type :- ${typeof lastName}`);
    // console.log(`${isAdmin} - type :- ${typeof isAdmin}`);
    if (typeof firstName != "string") throw new Error("invalid first name...");
    if (typeof lastName != "string") throw new Error("invalid last name...");
    if (firstName == lastName)
      throw new Error("invalid first name and last name...");
    if (typeof username != "string") throw new Error("invalid username type");
    if (typeof password != "string") throw new Error("invalid password type");

    //let admin = User.allAdmin[0];
    // let admin = await User.findAdmin(1);
    // admin = admin.toJSON();
    // console.log("iint");
    // console.log(admin);

    const user = await User.createStaff(
      firstName,
      lastName,
      username,
      password
    );
    if (!user) {
      throw new BadRequest("user could not been created");
    }
    Logger.info("create user controller ended...");
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

//get user by id
const getUserByID = async (req, res, next) => {
  try {
    Logger.info("getUserByID function called...");
    let userID = parseInt(req.params.id);
    validateID(userID);

    const user = await User.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    Logger.info("getUser controller ended");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//get all users
const getAllUsers = async (req, res, next) => {
  try {
    Logger.info("getAllUsers called...");

    let allUsers = await User.getAllStaff();
    if (allUsers.length == 0) throw new Error("No users found...");
    res.status(200).json(allUsers);
    Logger.info("get all users controller ended...");
  } catch (error) {
    next(error);
  }
};

//update staff by id
const updateUserByID = async (req, res, next) => {
  try {
    Logger.info("updateUser called...");
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.id);
    validateID(userID);
    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");
    const updatedUser = await User.updateUserByID(userID, parameter, value);
    if (updatedUser == null)
      throw new Error("User not found or updation failed...");
    Logger.info("updateUser controller ended");
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUserByID = (req, res) => {
  try {
    Logger.info("deleteUser called");
    const userID = parseInt(req.params.id);
    validateID(userID);
    try {
      User.deleteUserByID(userID);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "User not found or deletion failed" });
    }
    Logger.info("deleteUser controller Ended");
    res.status(200).json({
      message: `User with ID ${userID} has been deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    next(error);
  }
};
module.exports = {
  createUser,
  getUserByID,
  getAllUsers,
  updateUserByID,
  deleteUserByID,
};
