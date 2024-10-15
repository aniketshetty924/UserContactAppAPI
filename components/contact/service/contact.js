const ContactDetails = require("../../contactDetails/service/contactDetails.js");
const db = require("../../../models");
const badRequest = require("../../../errors/badRequest.js");
const NotFoundError = require("../../../errors/notFoundError.js");
class Contact {
  constructor(userId, firstName, lastName, isActive) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive;
    //this.contactDetails = contactDetails;
  }
  //getters
  // getContactID() {
  //   return this.contactID;
  // }
  getContactFirstName() {
    return this.firstName;
  }
  getContactLastName() {
    return this.lastName;
  }
  getContactIsActive() {
    return this.isActive;
  }
  getContactDetails() {
    return this.contactDetails;
  }
  //factory function for Contact
  static async newContact(userId, firstName, lastName, isActive) {
    try {
      //let contactID = ID;

      let tempContact = new Contact(userId, firstName, lastName, isActive);
      console.log(tempContact);
      console.log(db.contacts);
      const dbResponse = await db.contacts.create(tempContact);
      console.log("DB....");
      console.log(dbResponse);
      return dbResponse;
    } catch (error) {
      throw error;
    }
  }

  static async getContactByID(userID, contactID) {
    try {
      const contact = await db.contacts.findOne({
        where: {
          id: contactID,
          userId: userID,
        },
        include: [
          {
            model: db.contactDetails,
            as: "contactDetails",
          },
        ],
      });
      if (!contact) throw new NotFoundError("Contact not found...");
      return contact;
    } catch (error) {
      throw error;
    }
  }

  static async getAllContacts(userID) {
    try {
      let allContacts = await db.contacts.findAll({
        where: {
          userId: userID,
        },
        include: [
          {
            model: db.contactDetails,
            as: "contactDetails",
          },
        ],
      });
      return allContacts;
    } catch (error) {
      throw error;
    }
  }

  //update staff contact
  static async updateContactByID(userID, contactID, parameter, value) {
    try {
      if (typeof parameter != "string") throw new Error("Invalid parameter");
      if (typeof value != "string") throw new Error("invalid value");

      switch (parameter) {
        case "firstName":
          await db.contacts.update(
            {
              firstName: value,
            },
            {
              where: {
                userId: userID,
                id: contactID,
              },
            }
          );
          break;

        case "lastName":
          await db.contacts.update(
            {
              lastName: value,
            },
            {
              where: {
                userId: userID,
                id: contactID,
              },
            }
          );
          break;

        default:
          throw new badRequest("Enter a valid paramter to change....");
      }

      return await Contact.getContactByID(userID, contactID);
    } catch (error) {
      throw error;
    }
  }

  //update each contact property
  // updateContactFirstName(firstName) {
  //   try {
  //     if (typeof firstName != "string")
  //       throw new Error("Enter a valid first name!");

  //     if (firstName === this.lastName) throw new Error("invalid first name...");
  //     this.firstName = firstName;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // updateContactLastName(lastName) {
  //   try {
  //     if (typeof lastName != "string")
  //       throw new Error("Enter a valid last name!");

  //     if (lastName === this.firstName) throw new Error("invalid last name...");
  //     this.lastName = lastName;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //delete contact by id
  static async deleteStaffContactByID(userID, contactID) {
    try {
      // this.isActive = false;
      await db.contacts.update(
        { isActive: false },
        {
          where: {
            userId: userID,
            id: contactID,
          },
        }
      );
      await db.contacts.destroy({
        where: {
          userId: userID,
          id: contactID,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  newContactDetails(numberType, emailType) {
    try {
      if (typeof numberType != "object") throw new Error("invalid numberType");
      if (typeof emailType != "object") throw new Error("invalid email type!");
      let contactDetailsID = this.contactDetails.length;
      let createdContactDetail = ContactDetails.newContactDetails(
        contactDetailsID,
        numberType,
        emailType
      );

      this.contactDetails.push(createdContactDetail);
      return createdContactDetail;
    } catch (error) {
      throw error;
    }
  }

  //get contact details by id
  getContactDetailsByID(cdID) {
    try {
      let allContactDetails = this.contactDetails;

      let reqContactDetail;
      for (let contactDetail of allContactDetails) {
        if (contactDetail.getContactDetailID() == cdID) {
          reqContactDetail = contactDetail;
        }
      }
      return reqContactDetail;
    } catch (error) {
      throw error;
    }
  }

  //update contact details by id
  updateContactDetailsByID(cdID, parameter, value) {
    try {
      if (!this.isActive)
        throw new Error("oops the contact does not exists .....");
      let reqContactDetail = this.getContactDetailsByID(cdID);
      reqContactDetail.updateContactDetails(parameter, value);
      return reqContactDetail;
    } catch (error) {
      throw error;
    }
  }
  //delete Contact detail by ID
  deleteStaffContactDetailByID(cdID) {
    try {
      if (cdID > this.contactDetails.length) throw new Error("invalid cd id");

      this.contactDetails = this.contactDetails.filter(
        (contactDetail) => contactDetail.getContactDetailID() != cdID
      );
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Contact;
