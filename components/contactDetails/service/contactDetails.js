class ContactDetails {
  //id,type->home,work,email
  constructor(contactDetailsID, numberType, emailType) {
    this.contactDetailsID = contactDetailsID;
    this.numberType = numberType;
    this.emailType = emailType;
  }
  //getters
  getContactDetailID() {
    return this.contactDetailsID;
  }
  static newContactDetails(contactDetailsID, numberType, emailType) {
    try {
      if (typeof numberType != "object") throw new Error("invalid numberType");
      if (typeof emailType != "object") throw new Error("invalid email type!");
      let cdID = contactDetailsID;
      let tempContactDetails = new ContactDetails(cdID, numberType, emailType);
      return tempContactDetails;
    } catch (error) {
      throw error;
    }
  }

  //update contact details of particular staff contact by id
  updateContactDetails(parameter, value) {
    try {
      switch (parameter) {
        case "numberType":
          this.updateNumberType(value);
          break;

        case "emailType":
          this.updateEmailType(value);
          break;

        default:
          throw new Error("Enter a valid parameter to change...");
      }

      return this;
    } catch (error) {
      throw error;
    }
  }
  updateNumberType(numberType) {
    try {
      if (typeof numberType != "object")
        throw new Error("invalid parameter and value ....");
      this.numberType = numberType;
    } catch (error) {
      throw error;
    }
  }

  updateEmailType(emailType) {
    try {
      if (typeof emailType != "object")
        throw new Error("invalid parameter and value ....");
      this.emailType = emailType;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactDetails;
