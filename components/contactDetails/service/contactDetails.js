const badRequest = require("../../../errors/badRequest");
const db = require("../../../models");
class ContactDetails {
  //id,type->home,work,email
  constructor(numberType, number, emailType, email, contactId) {
    this.numberType = numberType;
    this.number = number;
    this.emailType = emailType;
    this.email = email;
    this.contactId = contactId;
  }
  //getters
  // getContactDetailID() {
  //   return this.contactDetailsID;
  // }
  static async newContactDetails(
    contactID,
    numberType,
    number,
    emailType,
    email
  ) {
    try {
      if (typeof numberType != "string")
        throw new badRequest("invalid number type...");
      if (typeof number != "string") throw new badRequest("invalid number...");
      if (typeof emailType != "string")
        throw new badRequest("invalid email type...");
      if (typeof email != "string") throw new badRequest("invalid email...");

      let tempContactDetails = new ContactDetails(
        numberType,
        number,
        emailType,
        email,
        contactID
      );
      console.log(tempContactDetails);
      const dbResponse = await db.contactDetails.create(tempContactDetails);
      return dbResponse;
    } catch (error) {
      throw error;
    }
  }

  static async getContactDetailsByID(contactID, cdID) {
    try {
      const contactDetail = await db.contactDetails.findOne({
        where: {
          id: cdID,
          contactId: contactID,
        },
      });
      return contactDetail;
    } catch (error) {
      throw error;
    }
  }

  static async getAllContactDetails(contactID) {
    try {
      const allContactDetails = await db.contactDetails.findAll({
        where: {
          contactId: contactID,
        },
      });
      return allContactDetails;
    } catch (error) {
      throw error;
    }
  }
  //update contact details of particular staff contact by id
  static async updateContactDetails(contactID, cdID, parameter, value) {
    try {
      const valueType = Object.keys(value);
      switch (parameter) {
        case "numberType":
          //this.updateNumberType(value);
          await db.contactDetails.update(
            {
              numberType: valueType[0],
              number: value[valueType],
            },
            {
              where: {
                contactId: contactID,
                id: cdID,
              },
            }
          );
          break;

        case "emailType":
          //this.updateEmailType(value);
          await db.contactDetails.update(
            {
              emailType: valueType[0],
              email: value[valueType],
            },
            {
              where: {
                contactId: contactID,
                id: cdID,
              },
            }
          );
          break;

        default:
          throw new Error("Enter a valid parameter to change...");
      }

      return await ContactDetails.getContactDetailsByID(contactID, cdID);
    } catch (error) {
      throw error;
    }
  }
  // updateNumberType(numberType) {
  //   try {
  //     if (typeof numberType != "object")
  //       throw new Error("invalid parameter and value ....");
  //     this.numberType = numberType;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // updateEmailType(emailType) {
  //   try {
  //     if (typeof emailType != "object")
  //       throw new Error("invalid parameter and value ....");
  //     this.emailType = emailType;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  static async deleteContactDetailsByID(contactID, cdID) {
    try {
      await db.contactDetails.destroy({
        where: {
          contactId: contactID,
          id: cdID,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactDetails;
