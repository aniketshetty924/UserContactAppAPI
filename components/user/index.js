const express = require("express");
const {
  createUser,
  getUserByID,
  getAllUsers,
  updateUserByID,
  deleteUserByID,
} = require("./controller/userApi.js");
const {
  verifyAdmin,
  verifyStaff,
} = require("../../middleware/authorization.js");
const contactRouter = require("../contact/index.js");

const userRouter = express.Router();
// api/v1/contact-app/user

// //create admin
// userRouter.post("/", );
//create user
userRouter.post("/", verifyAdmin, createUser);

//get user by id
//get
userRouter.get("/:id", verifyAdmin, getUserByID);

//get all users
userRouter.get("/", verifyAdmin, getAllUsers);

//update user by id
userRouter.put("/:id", verifyAdmin, updateUserByID);

//delete user by id
userRouter.delete("/:id", verifyAdmin, deleteUserByID);

userRouter.use("/:userID/contact", verifyStaff, contactRouter);
module.exports = userRouter;
