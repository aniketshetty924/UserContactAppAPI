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

router.post("/admin", async (req, res, next) => {
  try {
    const admin = await User.createAdmin(
      "Aniket",
      "Shetty",
      "aniketshetty12",
      "aniket@123"
    );
    console.log(admin);
    // console.log(User.allUsers);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let { username, password, userID } = req.body;
    if (typeof userID != "number" || userID < 0)
      throw new BadRequest("invalid user id...");
    if (typeof username != "string") {
      throw new BadRequest("username is invalid");
    }

    if (typeof password != "string") {
      throw new BadRequest("password is invalid");
    }
    // let admin = User.allAdmin[0];
    // console.log(admin)
    //const admin = await User.findAdmin(1);

    const user = await User.findUser(username);
    if (!user) throw new NotFoundError("user does not exists...");
    console.log("loginnnnnnn");
    console.log(user.isAdmin);
    if (await bcrypt.compare(password, user.password)) {
      let payload = Payload.newPayload(userID, user.isAdmin);
      let token = payload.signPayload();
      console.log("login payload");
      console.log(payload);
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
