const User = require("../../user/service/user.js");
const Logger = require("../../../utils/logger.js");
const NotFoundError = require("../../../errors/notFoundError.js");
const BadRequest = require("../../../errors/badRequest.js");
//validation functions
const validateID = (id) => {
  if (typeof id != "number") throw new BadRequest("invalid id type...");
  if (id < 0) throw new BadRequest("id cannot be less than 0!");
};
//create contact by user id
//post
const createContact = (req, res, next) => {
  try {
    Logger.info("createContact called...");
    const { firstName, lastName } = req.body;
    const userID = parseInt(req.params.userID);
    // let user = User.getUserByID(userID);
    validateID(userID);
    if (typeof firstName != "string") throw new Error("invalid first name");

    if (typeof lastName != "string") throw new Error("invalid last name");

    if (firstName === lastName)
      throw new Error("invalid first name and last name!");
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    const contact = user.newContact(firstName, lastName);
    Logger.info("createContact controller ended");
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

//get all user contacts
const getAllContactsOfUser = (req, res, next) => {
  try {
    Logger.info("getAllContactsOfUser called");
    const userID = parseInt(req.params.userID);
    validateID(userID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    let allContacts = user.getAllContacts();
    if (allContacts.length == 0) throw new Error("No contacts found...");
    Logger.info("getAllContactsOfUser controller ended.");
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};
//get contact by id
const getContactByID = (req, res, next) => {
  try {
    Logger.info("getContactByID called");
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    validateID(userID);
    validateID(contactID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    const contact = user.getContactByID(contactID);
    Logger.info("getContactByID controller ended.");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactByID = (req, res, next) => {
  try {
    Logger.info("updateContactByID called");
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    validateID(userID);
    validateID(contactID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");

    const updatedContact = user.updateStaffContactByID(
      contactID,
      parameter,
      value
    );
    if (updatedContact == null)
      throw new Error("Contact not found or updation failed...");
    Logger.info("updateContactByID controller ended");
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const deleteContactByID = (req, res) => {
  try {
    Logger.info("deleteContactByID called");
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    validateID(userID);
    validateID(contactID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }
    try {
      user.deleteStaffContactByID(contactID);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Contact not found or deletion failed" });
    }
    Logger.info("deleteContactByID called");
    res.status(200).json({
      message: `Contact with ID ${contactID} has been deleted successfully...`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContactByID,
  updateContactByID,
  deleteContactByID,
  getAllContactsOfUser,
};
