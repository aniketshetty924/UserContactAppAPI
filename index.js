console.log("user contact APP");

const express = require("express");

// const bodyParser = require('body-parser');
const router = require("./components");
const app = express();
app.use(express.json());

app.use("/api/v1/contact-app", router);

app.listen(5500, () => {
  console.log("started at 5500");
});
