const express = require("express");

const userRouter = require("./user");
const router = express();
router.use("/user", userRouter);

module.exports = router;
