const express = require("express");
const User = require("./user/service/user.js");

const NotFoundError = require("../errors/notFoundError.js");
const BadRequest = require("../errors/badRequest.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const userRouter = require("./user");
const router = express();

const { Payload } = require("../middleware/authorization.js");
router.use(cookieParser());

// let admin1 = User.newUser(
//   "Aniket",
//   "Shetty",
//   true,
//   "aniketshetty12",
//   "aniket@123"
// );
let admin;

router.post("/admin", async (req, res, next) => {
  try {
    admin = await User.createAdmin(
      "Aniket",
      "Shetty",
      "aniketshetty12",
      "aniket@123"
    );
    // console.log(User.allUsers);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    // if (typeof username != "string") {
    //   throw new BadRequest("username is invalid");
    // }

    // if (typeof password != "string") {
    //   throw new BadRequest("password is invalid");
    // }
    let admin = User.allAdmin[0];
    console.log(admin);
    const user = admin.findUser(username);
    console.log(user);
    if (!user) throw new NotFoundError("user does not exists...");

    if (await bcrypt.compare(password, user.password)) {
      let payload = Payload.newPayload(user.userID, user.isAdmin);
      let token = payload.signPayload();

      res.cookie("auth", `Bearer ${token}`);
      //send into header
      res.set("auth", `Bearer ${token}`);
      res.status(200).send(token);
    } else {
      res.status(403).json({
        message: "password incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.use("/user", userRouter);

module.exports = router;
