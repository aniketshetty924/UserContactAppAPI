const User = require("../../user/service/user.js");
const BadRequest = require("../../../errors/badRequest.js");
const NotFoundError = require("../../../errors/notFoundError.js");
//validation functions
const validateID = (id) => {
  if (typeof id != "number") throw new BadRequest("invalid id type...");
  if (id < 0) throw new BadRequest("id cannot be less than 0!");
};

//create contact details of user contact
//post
const createContactDetails = (req, res, next) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);

    validateID(userID);
    validateID(contactID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    const { numberType, emailType } = req.body;
    if (typeof numberType != "object")
      throw new BadRequest("invalid numberType");
    if (typeof emailType != "object")
      throw new BadRequest("invalid email type!");

    const contactDetail = user.newContactDetails(
      contactID,
      numberType,
      emailType
    );
    res.status(201).json(contactDetail);
  } catch (error) {
    next(error);
  }
};

//get all contact details
const getAllContactDetailsOfUser = (req, res, next) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);

    validateID(userID);
    validateID(contactID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    let allContactDetails = user.getAllContactDetails(contactID);
    if (allContactDetails.length == 0)
      throw new BadRequest("No contacts found...");
    res.status(200).json(allContactDetails);
  } catch (error) {
    next(error);
  }
};

//get contact details by id
const getContactDetailsByID = (req, res, next) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);
    validateID(userID);
    validateID(contactID);
    validateID(cdID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    const contactDetail = user.getContactDetailsByID(contactID, cdID);
    res.status(200).json(contactDetail);
  } catch (error) {
    next(error);
  }
};

//update contact details
const updateContactDetailsByID = (req, res, next) => {
  try {
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);

    validateID(userID);
    validateID(contactID);
    validateID(cdID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");

    const updatedContactDetail = user.updateContactDetailsByID(
      contactID,
      cdID,
      parameter,
      value
    );
    if (updatedContactDetail == null)
      throw new Error("Contact not found or updation failed...");
    res.status(200).json(updatedContactDetail);
  } catch (error) {
    next(error);
  }
};

const deleteContactDetailsByID = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);

    validateID(userID);
    validateID(contactID);
    validateID(cdID);
    let admin = User.allAdmin[0];

    let user = admin.getStaffByID(userID);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    try {
      user.deleteStaffContactDetailByID(contactID, cdID);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Contact not found or deletion failed" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactDetails,
  getContactDetailsByID,
  updateContactDetailsByID,
  deleteContactDetailsByID,
  getAllContactDetailsOfUser,
};
