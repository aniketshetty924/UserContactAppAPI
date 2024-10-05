const express = require("express");
const {
  createContactDetails,
  getContactDetailsByID,
  updateContactDetailsByID,
  deleteContactDetailsByID,
  getAllContactDetailsOfUser,
} = require("./controller/contactDetailsApi");

const contactDetailsRouter = express.Router({ mergeParams: true });
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails

//create contact details of user contact
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails
contactDetailsRouter.post("/", createContactDetails);

//get contact details by id of user contact
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails/:cdID
contactDetailsRouter.get("/:cdID", getContactDetailsByID);

//update contact details by id of user contact
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails/:cdID
contactDetailsRouter.put("/:cdID", updateContactDetailsByID);

//delete contact details by id of user contact
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails/:cdID
contactDetailsRouter.delete("/:cdID", deleteContactDetailsByID);

//get all contact details of user contact
//api/v1/contact-app/user/:userid/contact/:contactID/contactDetails
contactDetailsRouter.get("/", getAllContactDetailsOfUser);

module.exports = contactDetailsRouter;
