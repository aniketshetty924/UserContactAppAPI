const ContactDetails = require("../../contactDetails/service/contactDetails.js");

class Contact {
  constructor(contactID, firstName, lastName, isActive, contactDetails) {
    this.contactID = contactID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive;
    this.contactDetails = contactDetails;
  }
  //getters
  getContactID() {
    return this.contactID;
  }
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
  static newContact(firstName, lastName, ID) {
    try {
      let contactID = ID;
      let tempContact = new Contact(contactID, firstName, lastName, true, []);
      return tempContact;
    } catch (error) {
      throw error;
    }
  }

  //update staff contact
  updateContactByID(parameter, value) {
    try {
      if (typeof parameter != "string") throw new Error("Invalid parameter");
      if (typeof value != "string") throw new Error("invalid value");

      switch (parameter) {
        case "firstName":
          this.updateContactFirstName(value);
          break;

        case "lastName":
          this.updateContactLastName(value);
          break;

        default:
          throw new Error("Enter a valid paramter to change....");
      }
    } catch (error) {
      throw error;
    }
  }

  //update each contact property
  updateContactFirstName(firstName) {
    try {
      if (typeof firstName != "string")
        throw new Error("Enter a valid first name!");

      if (firstName === this.lastName) throw new Error("invalid first name...");
      this.firstName = firstName;
    } catch (error) {
      throw error;
    }
  }

  updateContactLastName(lastName) {
    try {
      if (typeof lastName != "string")
        throw new Error("Enter a valid last name!");

      if (lastName === this.firstName) throw new Error("invalid last name...");
      this.lastName = lastName;
    } catch (error) {
      throw error;
    }
  }

  //delete contact by id
  deleteStaffContactByID(contactID) {
    try {
      this.isActive = false;
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
