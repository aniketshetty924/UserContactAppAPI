const Contact = require("../../contact/service/contact.js");
const bcrypt = require("bcrypt");
const db = require("../../../models");
const NotFoundError = require("../../../errors/notFoundError.js");
const ContactDetails = require("../../contactDetails/service/contactDetails.js");
const badRequest = require("../../../errors/badRequest.js");
class User {
  //firstName,lastName,isAdmin,isActive,contacts

  static allUsers = [];
  static allUsersID = 0;
  static allAdmin = [];
  static allStaff = [];
  //getters

  constructor(
    //userID,

    firstName,
    lastName,
    username,
    password,
    isAdmin,
    isActive
    //contacts
  ) {
    //this.userID = userID;

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isActive = isActive;
    //this.contacts = contacts;
  }

  //create admin
  static async createAdmin(firstName, lastName, username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      //let userID = User.allUsersID++;
      let tempAdmin = new User(
        //userID,
        firstName,
        lastName,
        username,
        hashedPassword,
        true,
        true
      );

      // User.allAdmin.push(tempAdmin);
      // User.allUsers.push(tempAdmin);
      //console.log(db.users);
      const dbResponse = await db.users.create(tempAdmin);
      console.log("Admin created --> dbResponse -->", dbResponse);
      return tempAdmin;
    } catch (error) {
      throw error;
    }
  }
  //user factory function
  static async createStaff(firstName, lastName, username, password) {
    try {
      // if (!this.isAdmin) {
      //   throw new Error("user is not Admin");
      // }
      // if (!this.isActive) {
      //   throw new Error("admin is not active");
      // }

      const hashedPassword = await bcrypt.hash(password, 10);

      //let userID = User.allUsersID++;
      let tempStaff = new User(
        //userID,
        firstName,
        lastName,
        username,
        hashedPassword,
        false,
        true
      );

      // User.allStaff.push(tempStaff);
      // User.allUsers.push(tempStaff);
      const dbResponse = await db.users.create(tempStaff);
      console.log("Staff created :--> dbResponse:-->", dbResponse);
      return dbResponse;
    } catch (error) {
      throw error;
    }
  }
  static async findAdmin(userID) {
    try {
      let admin = await db.users.findByPk(userID);

      return admin;
    } catch (error) {
      throw error;
    }
  }
  static async findAdminByUserName(username) {
    try {
      // if (!this.isAdmin) {
      //   throw new Error("user is not Admin");
      // }
      // if (!this.isActive) {
      //   throw new Error("admin is not active");
      // }
      const admin = await db.users.findOne({ where: { username } });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  static async findUser(username) {
    try {
      //if (!this.isAdmin) throw new Error("only admins get users..");
      const user = await db.users.findOne({ where: { username } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  //find staff by username
  findUserByUsername(username) {
    try {
      let allStaffs = User.allStaff;
      for (let user of allStaffs) {
        if (user.username == username && user.isActive == true) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  // //get all users
  // static getAllUsers() {
  //   let allUsers = User.allUsers;
  //   let users = [];
  //   for (let user of allUsers) {
  //     if (user.isActive == true) {
  //       users.push(user);
  //     }
  //   }
  //   return allUsers;
  // }

  //get all admin
  // static getAllAdmin() {
  //   return User.allAdmin;
  // }

  //get all staffs
  static async getAllStaff() {
    try {
      // if (!this.isAdmin) {
      //   throw new Error("user is not Admin");
      // }
      // if (!this.isActive) {
      //   throw new Error("admin is not active");
      // }

      const allUsers = await db.users.findAll({
        where: {
          isAdmin: false,
        },
        include: [
          {
            model: db.contacts,
            as: "contacts",
            include: [
              {
                model: db.contactDetails,
                as: "contactDetails",
              },
            ],
          },
        ],
      });
      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  //get all user contacts
  static getUserContacts(userID) {
    try {
      let user = User.getUserByID(userID);
      if (user.isAdmin == true) throw new Error("only staffs have contacts...");
      if (user.isActive == false)
        throw new Error("User is already been deleted...");
      let allUserContacts = [];
      allUserContacts = user.contacts;
      let allUserContactsList = [];
      allUserContactsList = allUserContacts.filter((obj) => {
        return obj.isActive === true;
      });
      return allUserContactsList;
    } catch (error) {
      console.log(error);
    }
  }
  //get staff by id
  static async getStaffByID(staffID) {
    try {
      // if (!this.isAdmin) {
      //   throw new Error("user is not Admin");
      // }
      // if (!this.isActive) {
      //   throw new Error("admin is not active");
      // }

      const staff = await db.users.findOne({
        where: {
          id: staffID,
          isAdmin: false,
        },
        include: [
          {
            model: db.contacts,
            as: "contacts",
            include: [
              {
                model: db.contactDetails,
                as: "contactDetails",
              },
            ],
          },
        ],
      });
      if (!staff) throw new NotFoundError("User not found...");
      return staff;
    } catch (error) {
      throw error;
    }
  }
  //get user by id
  static getUserViaID(ID, isAdmin, isStaff) {
    try {
      if (isAdmin) {
        let allAdmins = User.allAdmin;
        for (let admin of allAdmins) {
          if (admin.userID == ID) {
            return admin;
          }
        }
      }
      if (isStaff) {
        let allStaffs = User.allStaff;
        for (let staff of allStaffs) {
          if (staff.userID == ID) {
            if (!staff.isActive)
              throw new Error(
                `Oops staff with ID ${ID} is already been deleted... so you cant access it now!`
              );
            return staff;
          }
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  static getUserByID(userID) {
    try {
      //   User.validateID(userID);
      return User.getUserViaID(userID, true, true);
    } catch (error) {
      console.log(error);
    }
  }

  updateFirstName(firstName) {
    try {
      if (typeof firstName != "string")
        throw new Error("Enter a valid first name!");

      if (firstName === this.lastName) throw new Error("invalid first name...");
      this.firstName = firstName;
    } catch (error) {
      throw error;
    }
  }
  updateLastName(lastName) {
    try {
      if (typeof lastName != "string")
        throw new Error("Enter a valid last name!");

      if (lastName === this.firstName) throw new Error("invalid last name...");
      this.lastName = lastName;
    } catch (error) {
      throw error;
    }
  }
  //update staff by id
  static async updateUserByID(staffID, parameter, value) {
    try {
      // if (!this.isAdmin) {
      //   throw new Error("user is not Admin");
      // }
      // if (!this.isActive) {
      //   throw new Error("admin is not active");
      // }
      // let foundStaff = this.getStaffByID(staffID);

      // if (!foundStaff.isActive)
      //   throw new Error(
      //     `User with ID ${staffID} has been deleted earlier...., So it cannot be UPDATED!`
      //   );

      switch (parameter) {
        case "firstName":
          // foundStaff.updateFirstName(value);
          await db.users.update(
            { firstName: value },
            {
              where: {
                id: staffID,
              },
            }
          );
          break;
        case "lastName":
          await db.users.update(
            { lastName: value },
            {
              where: {
                id: staffID,
              },
            }
          );
          break;

        case "username":
          await db.users.update(
            { username: value },
            {
              where: {
                id: staffID,
              },
            }
          );
          break;
        case "password":
          let hashedPassword = await bcrypt.hash(value, 10);
          await db.users.update(
            { password: hashedPassword },
            {
              where: {
                id: staffID,
              },
            }
          );
          break;
        default:
          console.log("Enter a valid parameter to change...");
      }
      let updatedUser = await User.getStaffByID(staffID);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  //delete user by id
  static async deleteUserByID(staffID) {
    try {
      // let foundStaff = this.getStaffByID(staffID);
      // if (!foundStaff.isActive)
      //   throw new Error(
      //     `The given staff with ID ${staffID} is already been deleted earlier....,NOTHING to delete now!`
      //   );
      let user = await User.getStaffByID(staffID);
      if (!user)
        throw new NotFoundError(
          "user has already been deleted or does not exists..."
        );
      await db.users.update(
        { isActive: false },
        {
          where: {
            id: staffID,
          },
        }
      );
      await db.users.destroy({ where: { id: staffID } });

      //foundStaff.isActive = false;

      console.log(`user with user ID ${staffID} is deleted...`);
    } catch (error) {
      throw error;
    }
  }

  //creating contact object for particular staff object
  static async newContact(userId, firstName, lastName, isActive) {
    try {
      // if (this.isAdmin) {
      //   throw new Error("Admin cannot create contact");
      // }
      // if (!this.isActive) {
      //   throw new Error("Inactive users cannot create contacts");
      // }

      //let contactID = this.contacts.length;
      let createdContact = await Contact.newContact(
        userId,
        firstName,
        lastName,
        isActive
      );
      // let tempContact = new Contact(userId, firstName, lastName, isActive);
      // console.log(tempContact);
      // let createdContact = await db.contacts.create(tempContact);

      //this.contacts.push(createdContact);
      return createdContact;
    } catch (error) {
      throw error;
    }
  }

  static async getContactByID(userId, contactId) {
    try {
      const contact = await Contact.getContactByID(userId, contactId);
      return contact;
    } catch (error) {
      throw error;
    }
  }

  //get all contacts
  getAllContacts() {
    return this.contacts.filter((contact) => contact.isActive);
  }

  static async getAllContacts(userID) {
    try {
      let allContacts = await Contact.getAllContacts(userID);
      if (allContacts.length == 0)
        throw new NotFoundError(
          `No contacts of user with ${userID} was found...`
        );
      return allContacts;
    } catch (error) {
      throw error;
    }
  }

  //update staff contact by id
  static async updateStaffContactByID(userID, contactID, parameter, value) {
    try {
      // let staffContactToUpdate = this.getContactByID(contactID);
      // staffContactToUpdate.updateContactByID(parameter, value);

      let updatedStaffContact = await Contact.updateContactByID(
        userID,
        contactID,
        parameter,
        value
      );
      return updatedStaffContact;
    } catch (error) {
      throw error;
    }
  }

  //delete staff contact by id
  static async deleteStaffContactByID(userID, contactID) {
    try {
      // let staffContactToDelete = this.getContactByID(contactID);
      // staffContactToDelete.deleteStaffContactByID(contactID);

      await Contact.deleteStaffContactByID(userID, contactID);
    } catch (error) {
      throw error;
    }
  }

  static async newContactDetails(userID, contactID, numberObj, emailObj) {
    try {
      if (typeof numberObj != "object") throw new Error("invalid numberType");
      if (typeof emailObj != "object") throw new Error("invalid email type!");
      console.log(numberObj);
      console.log(emailObj);
      const numberType = Object.keys(numberObj);

      const emailType = Object.keys(emailObj);

      let contact = await Contact.getContactByID(userID, contactID);
      if (!contact)
        throw new NotFoundError(
          "Contact has already been deleted or does not exists..."
        );

      const contactDetail = await ContactDetails.newContactDetails(
        contactID,
        numberType[0],
        numberObj[numberType],
        emailType[0],
        emailObj[emailType]
      );

      return contactDetail;
    } catch (error) {
      throw error;
    }
  }

  //get all contact details
  static async getAllContactDetails(userID, contactID) {
    try {
      let contact = await Contact.getContactByID(userID, contactID);
      if (!contact)
        throw new NotFoundError(
          "Contact has already been deleted or does not exists..."
        );
      const allContactDetails = await ContactDetails.getAllContactDetails(
        contactID
      );

      if (allContactDetails.length == 0)
        throw new NotFoundError("No contact details found...");
      // let staffContact = this.getContactByID(contactID);
      // let allContactDetails = staffContact.getContactDetails();
      return allContactDetails;
    } catch (error) {
      throw error;
    }
  }

  //get contact details by id via staff
  //cd->contact detail
  static async getContactDetailsByID(userID, contactID, cdID) {
    try {
      let contact = await Contact.getContactByID(userID, contactID);
      if (!contact)
        throw new NotFoundError(
          "Contact has already been deleted or does not exists..."
        );

      let contactDetail = await ContactDetails.getContactDetailsByID(
        contactID,
        cdID
      );
      if (!contactDetail)
        throw new NotFoundError("Contact detail not found...");

      // let staffContact = this.getContactByID(contactID);
      // let contactDetail = staffContact.getContactDetailsByID(cdID);
      return contactDetail;
    } catch (error) {
      throw error;
    }
  }
  // //get contact details by id of user contact
  // static getContactDetailsByID(staffID, contactID, cdID) {
  //   try {
  //     let staff = User.getStaffByID(staffID);
  //     if (staff.isAdmin)
  //       throw new Error("Only staffs can create new contact details....");
  //     if (!staff.isActive)
  //       throw new Error("OOps the current staff is does not exists!");
  //     let staffContact = staff.getContactByID(contactID);
  //     let contactDetail = staffContact.getContactDetailsByID(cdID);
  //     return contactDetail;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //update contact details of particular staff contact by id
  static async updateContactDetailsByID(
    userID,
    contactID,
    cdID,
    parameter,
    value
  ) {
    try {
      let contact = await Contact.getContactByID(userID, contactID);
      if (!contact)
        throw new NotFoundError(
          "Contact has already been deleted or does not exists..."
        );
      if (typeof value != "object")
        throw new badRequest("invalid value type...");

      const valueType = Object.keys(value);

      const updatedContactDetail = await ContactDetails.updateContactDetails(
        contactID,
        cdID,
        parameter,
        value
      );

      return updatedContactDetail;
    } catch (error) {
      throw error;
    }
  }

  //delete contact details by id
  static async deleteStaffContactDetailByID(userID, contactID, cdID) {
    try {
      let contact = await Contact.getContactByID(userID, contactID);
      if (!contact)
        throw new NotFoundError(
          "Contact has already been deleted or does not exists..."
        );

      //let staffContact = this.getContactByID(contactID);
      await ContactDetails.deleteContactDetailsByID(contactID, cdID);
      //staffContact.deleteStaffContactDetailByID(cdID);
      console.log(
        `contact detail with id ${cdID} of contact ID ${contactID} is deleted succesfully`
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
