const express = require("express");

const {
  createContact,
  getContactByID,
  updateContactByID,
  deleteContactByID,
  getAllContactsOfUser,
} = require("./controller/contactApi");
const contactDetailsRouter = require("../contactDetails");
//api/v1/contact-app/user
const contactRouter = express.Router({ mergeParams: true });

//create contact //post
//api/v1/contact-app/user/:userid/contact
contactRouter.post("/", createContact);

//api/v1/contact-app/user/:userid/contact/contactID
contactRouter.get("/:contactID", getContactByID);

//get all contacts of particular user
//api/v1/contact-app/user/:userid/contact
contactRouter.get("/", getAllContactsOfUser);

//api/v1/contact-app/user/:userid/contact/contactID
contactRouter.put("/:contactID", updateContactByID);

//api/v1/contact-app/user/:userid/contact/contactID
contactRouter.delete("/:contactID", deleteContactByID);

contactRouter.use("/:contactID/contactDetails", contactDetailsRouter);
module.exports = contactRouter;
