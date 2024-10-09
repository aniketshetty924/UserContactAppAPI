const Contact = require("../../contact/service/contact.js");
const bcrypt = require("bcrypt");
class User {
  //firstName,lastName,isAdmin,isActive,contacts

  static allUsers = [];
  static allUsersID = 0;
  static allAdmin = [];
  static allStaff = [];
  //getters

  constructor(
    userID,
    userName,
    firstName,
    lastName,
    password,
    isAdmin,
    isActive,
    contacts
  ) {
    this.userID = userID;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isActive = isActive;
    this.contacts = contacts;
  }

  //create admin
  static async createAdmin(firstName, lastName, username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let userID = User.allUsersID++;
      let tempAdmin = new User(
        userID,
        username,
        firstName,
        lastName,
        hashedPassword,
        true,
        true,
        []
      );
      User.allAdmin.push(tempAdmin);
      User.allUsers.push(tempAdmin);
      return tempAdmin;
    } catch (error) {
      console.log(error);
    }
  }
  //user factory function
  async createStaff(firstName, lastName, username, password) {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let userID = User.allUsersID++;
      let tempStaff = new User(
        userID,
        username,
        firstName,
        lastName,
        hashedPassword,
        false,
        true,
        []
      );

      User.allStaff.push(tempStaff);
      User.allUsers.push(tempStaff);
      return tempStaff;
    } catch (error) {
      console.log(error);
    }
  }
  static findAdmin() {
    try {
      return User.allAdmin[0];
    } catch (error) {
      console.log(error);
    }
  }
  findAdminByUserName(userName) {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }
      let allAdmins = User.getAllAdmin();
      for (admin of allAdmins) {
        if (admin.userName == userName) {
          return admin;
        }
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  findUser(username) {
    try {
      if (!this.isAdmin) throw new Error("only admins get users..");

      for (let user of User.allUsers) {
        if (user.username == username && user.isActive) {
          console.log(`user : ${user}`);
          return user;
        }
      }
      return null;
    } catch (error) {
      console.log(error);
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
  static getAllAdmin() {
    return User.allAdmin;
  }
  //get all staffs
  getAllStaff() {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }
      let allStaffs = User.allStaff;
      let staffList = [];
      for (let staff of allStaffs) {
        if (staff.isActive) {
          staffList.push(staff);
        }
      }
      return staffList;
    } catch (error) {
      console.log(error);
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
  getStaffByID(staffID) {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }
      let allStaffs = User.allStaff;
      for (let staff of allStaffs) {
        if (staff.userID == staffID) {
          if (!staff.isActive)
            throw new Error(
              `Oops staff with ID ${staffID} is already been deleted... so you cant access it now!`
            );
          return staff;
        }
      }
      return null;
    } catch (error) {
      console.log(error);
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
  updateUserByID(staffID, parameter, value) {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }
      let foundStaff = this.getStaffByID(staffID);

      if (!foundStaff.isActive)
        throw new Error(
          `User with ID ${staffID} has been deleted earlier...., So it cannot be UPDATED!`
        );

      switch (parameter) {
        case "firstName":
          foundStaff.updateFirstName(value);
          break;
        case "lastName":
          foundStaff.updateLastName(value);
          break;
        default:
          console.log("Enter a valid parameter to change...");
      }
      return foundStaff;
    } catch (error) {
      console.log(error);
    }
  }

  //delete user by id
  deleteUserByID(staffID) {
    try {
      if (!this.isAdmin) {
        throw new Error("user is not Admin");
      }
      if (!this.isActive) {
        throw new Error("admin is not active");
      }
      let foundStaff = this.getStaffByID(staffID);
      if (!foundStaff.isActive)
        throw new Error(
          `The given staff with ID ${staffID} is already been deleted earlier....,NOTHING to delete now!`
        );

      foundStaff.isActive = false;

      console.log(`Staff with staff ID ${staffID} is deleted...`);
    } catch (error) {
      console.log(error);
    }
  }

  //creating contact object for particular staff object
  newContact(firstName, lastName) {
    try {
      if (this.isAdmin) {
        throw new Error("Admin cannot create contact");
      }
      if (!this.isActive) {
        throw new Error("Inactive users cannot create contacts");
      }

      let contactID = this.contacts.length;
      let createdContact = Contact.newContact(firstName, lastName, contactID);

      this.contacts.push(createdContact);
      return createdContact;
    } catch (error) {
      console.log(error);
    }
  }

  getContactByID(contactID) {
    try {
      if (this.isAdmin) throw new Error("only staffs can get contacts ....");
      if (!this.isActive)
        throw new Error(
          "The  User  is already been deleted earlier...., So it cannot GET a contact now!"
        );

      let allContacts = this.contacts;

      let staffContact;
      for (let contact of allContacts) {
        if (contact.getContactID() == contactID) {
          if (contact.isActive == false) {
            throw new Error(
              `Contact with contact id : ${contactID} has been already deleted...`
            );
          }
          staffContact = contact;
          break;
        }
      }
      return staffContact;
    } catch (error) {
      console.log(error);
    }
  }

  //get all contacts
  getAllContacts() {
    return this.contacts.filter((contact) => contact.isActive);
  }

  //update staff contact by id
  updateStaffContactByID(contactID, parameter, value) {
    try {
      if (this.isAdmin) {
        throw new Error("Admin cannot update contact");
      }
      if (!this.isActive) {
        throw new Error("Inactive users cannot update contacts");
      }
      let staffContactToUpdate = this.getContactByID(contactID);
      staffContactToUpdate.updateContactByID(parameter, value);

      return staffContactToUpdate;
    } catch (error) {
      console.log(error);
    }
  }

  //delete staff contact by id
  deleteStaffContactByID(contactID) {
    try {
      if (this.isAdmin) {
        throw new Error("Admin cannot delete contact");
      }
      if (!this.isActive) {
        throw new Error("Inactive users cannot delete contacts");
      }
      let staffContactToDelete = this.getContactByID(contactID);
      staffContactToDelete.deleteStaffContactByID(contactID);
    } catch (error) {
      console.log(error);
    }
  }

  newContactDetails(contactID, numberType, emailType) {
    try {
      if (this.isAdmin)
        throw new Error("Only staffs can create new contact details....");
      if (!this.isActive)
        throw new Error("OOps the current staff is does not exists!");

      if (typeof numberType != "object") throw new Error("invalid numberType");
      if (typeof emailType != "object") throw new Error("invalid email type!");

      let staffContact = this.getContactByID(contactID);
      return staffContact.newContactDetails(numberType, emailType);
    } catch (error) {
      console.log(error);
    }
  }

  //get all contact details
  getAllContactDetails(contactID) {
    try {
      if (this.isAdmin)
        throw new Error("Only staffs can create new contact details....");
      if (!this.isActive)
        throw new Error("OOps the current staff is does not exists!");

      let staffContact = this.getContactByID(contactID);
      let allContactDetails = staffContact.getContactDetails();
      return allContactDetails;
    } catch (error) {
      console.log(error);
    }
  }

  //get contact details by id via staff
  //cd->contact detail
  getContactDetailsByID(contactID, cdID) {
    try {
      if (this.isAdmin)
        throw new Error("Only staffs can access contact details!");
      if (!this.isActive)
        throw new Error("OOps staff is already been deleted....");

      let staffContact = this.getContactByID(contactID);
      let contactDetail = staffContact.getContactDetailsByID(cdID);
      return contactDetail;
    } catch (error) {
      console.log(error);
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
  updateContactDetailsByID(contactID, cdID, parameter, value) {
    try {
      if (this.isAdmin)
        throw new Error("Only staffs can create new contact details....");
      if (!this.isActive)
        throw new Error("OOps the current staff is does not exists!");

      let staffContact = this.getContactByID(contactID);
      let updatedContactDetail = staffContact.updateContactDetailsByID(
        cdID,
        parameter,
        value
      );

      return updatedContactDetail;
    } catch (error) {
      console.log(error);
    }
  }

  //delete contact details by id
  deleteStaffContactDetailByID(contactID, cdID) {
    try {
      if (this.isAdmin)
        throw new Error("Only staffs can create new contact details....");
      if (!this.isActive)
        throw new Error("OOps the current staff is does not exists!");

      let staffContact = this.getContactByID(contactID);

      staffContact.deleteStaffContactDetailByID(cdID);
      console.log(
        `contact detail with id ${cdID} of contact ID ${contactID} is deleted succesfully`
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User;
