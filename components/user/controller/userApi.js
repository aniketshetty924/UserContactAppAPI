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

    let admin = User.allAdmin[0];

    const user = await admin.createStaff(
      firstName,
      lastName,
      username,
      password
    );
    if (!user) {
      throw new BadRequest("user could not been created");
    }
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

//get user by id
const getUserByID = (req, res) => {
  try {
    let userID = parseInt(req.params.id);
    if (typeof userID != "number")
      throw new Error("invalid user id... User id should be a number");
    if (userID < 0) throw new Error("invalid user id...");
    // console.log(`User id : ${userID} --> ${typeof userID}`);
    const user = User.getUserByID(userID);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//get all users
const getAllUsers = (req, res) => {
  try {
    let allUsers = User.getAllUsers();
    if (allUsers.length == 0) throw new Error("No users found...");
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//update staff by id
const updateUserByID = (req, res) => {
  try {
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");
    const updatedUser = User.updateUserByID(userID, parameter, value);
    if (updatedUser == null)
      throw new Error("User not found or updation failed...");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

const deleteUserByID = (req, res) => {
  try {
    const userID = parseInt(req.params.id);
    if (typeof userID != "number") throw new Error("invalid user id type...");
    if (userID < 0) throw new Error("invalid user id!");
    try {
      User.deleteUserByID(userID);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "User not found or deletion failed" });
    }
    res.status(200).json({
      message: `User with ID ${userID} has been deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
module.exports = {
  createUser,
  getUserByID,
  getAllUsers,
  updateUserByID,
  deleteUserByID,
};
