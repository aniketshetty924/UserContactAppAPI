const User = require("../../user/service/user.js");

//create contact by user id
//post
const createContact = (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userID = parseInt(req.params.userID);
    // let user = User.getUserByID(userID);

    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    if (typeof firstName != "string") throw new Error("invalid first name");

    if (typeof lastName != "string") throw new Error("invalid last name");

    if (firstName === lastName)
      throw new Error("invalid first name and last name!");

    const contact = User.newContact(userID, firstName, lastName);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

//get all user contacts
const getAllContactsOfUser = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    let allContacts = User.getUserContacts(userID);
    if (allContacts.length == 0) throw new Error("No contacts found...");
    res.status(200).json(allContacts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};
//get contact by id
const getContactByID = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    let user = User.getUserByID(userID);
    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (contactID >= user.contacts.length)
      throw new Error("invalid contact id..");

    const contact = user.getContactByID(contactID);

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
    console.log(error);
  }
};

const updateContactByID = (req, res) => {
  try {
    const { parameter, value } = req.body;
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    let user = User.getUserByID(userID);
    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (contactID >= user.contacts.length)
      throw new Error("invalid contact id..");
    if (typeof parameter != "string")
      throw new Error("invalid parameter type...");

    const updatedContact = User.updateStaffContactByID(
      userID,
      contactID,
      parameter,
      value
    );
    if (updatedContact == null)
      throw new Error("Contact not found or updation failed...");
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

const deleteContactByID = (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const contactID = parseInt(req.params.contactID);
    if (typeof userID != "number") throw new Error("invalid user id...");
    if (userID < 0) throw new Error("invalid user id!");
    let user = User.getUserByID(userID);
    if (typeof contactID != "number")
      throw new Error("invalid contact id type...");
    if (contactID < 0) throw new Error("invalid contact id!");
    if (contactID >= user.contacts.length)
      throw new Error("invalid contact id..");

    try {
      User.deleteStaffContactByID(userID, contactID);
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Contact not found or deletion failed" });
    }
    res.status(200).json({
      message: `Contact with ID ${contactID} has been deleted successfully...`,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

module.exports = {
  createContact,
  getContactByID,
  updateContactByID,
  deleteContactByID,
  getAllContactsOfUser,
};
