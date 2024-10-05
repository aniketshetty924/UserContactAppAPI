const express = require("express");
const {
  createUser,
  getUserByID,
  getAllUsers,
  updateUserByID,
  deleteUserByID,
} = require("./controller/userApi.js");
const contactRouter = require("../contact/index.js");

const userRouter = express.Router();
// api/v1/contact-app/user

//create admin
userRouter.post("/", createUser);

//get user by id
//get
userRouter.get("/:id", getUserByID);

//get all users
userRouter.get("/", getAllUsers);

//update user by id
userRouter.put("/:id", updateUserByID);

//delete user by id
userRouter.delete("/:id", deleteUserByID);

userRouter.use("/:userID/contact", contactRouter);
module.exports = userRouter;
