const User = require("../../user/service/user.js");

//create contact details of user contact
//post
const createContactDetails = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");

    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");

    const { numberType, emailType } = req.body;
    if (typeof numberType != "object") throw new Error("invalid numberType");
    if (typeof emailType != "object") throw new Error("invalid email type!");

    const contactDetail = User.newContactDetails(
      userID,
      contactID,
      numberType,
      emailType
    );
    res.status(201).json(contactDetail);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//get all contact details
const getAllContactDetailsOfUser = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");

    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");

    let allContactDetails = User.getAllContactDetails(userID, contactID);
    if (allContactDetails.length == 0) throw new Error("No contacts found...");
    res.status(200).json(allContactDetails);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//get contact details by id
const getContactDetailsByID = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");

    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (typeof cdID != "number") throw new Error("invalid contact id type...");
    if (cdID < 0) throw new Error("invalid contact id!");

    const contactDetail = User.getContactDetailsByID(userID, contactID, cdID);
    res.status(200).json(contactDetail);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//update contact details
const updateContactDetailsByID = (req, res) => {
  try {
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);

    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (typeof cdID != "number") throw new Error("invalid contact id type...");
    if (cdID < 0) throw new Error("invalid contact id!");

    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");

    const updatedContactDetail = User.updateContactDetailsByID(
      userID,
      contactID,
      cdID,
      parameter,
      value
    );
    if (updatedContactDetail == null)
      throw new Error("Contact not found or updation failed...");
    res.status(200).json(updatedContactDetail);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

const deleteContactDetailsByID = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    const cdID = parseInt(req.params.cdID);

    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (typeof cdID != "number") throw new Error("invalid contact id type...");
    if (cdID < 0) throw new Error("invalid contact id!");

    try {
      User.deleteStaffContactDetailByID(userID, contactID, cdID);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Contact not found or deletion failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

module.exports = {
  createContactDetails,
  getContactDetailsByID,
  updateContactDetailsByID,
  deleteContactDetailsByID,
  getAllContactDetailsOfUser,
};
