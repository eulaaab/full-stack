//backend
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const dotenv = require("dotenv");

//load dotenv
require("dotenv").config();

const API_PORT = process.env.API_PORT || 3000;
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;

const app = express();
const router = express.Router();
app.use(cors());

//mongoDB database
const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0-trxil.mongodb.net/test?retryWrites=true&w=majority`;

//connect backend to database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

let db = mongoose.connection;

//establish connection with database
db.once("open", () => console.log("connected to mongoDB database"));

//error db connection
db.on("error", console.error.bind(console, "MongoDB connection error"));

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

//get method
//fetches all data from database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err)
      return res.json(
        { success: false, error: err },
        console.log("error in getData")
      );
    return res.json({ success: true, data: data });
  });
});

//update method
//overwrite existing data
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//delete method
//remove existing
router.delete("/deleteData", (req, res) => {
  const { id } = req.body; //req.body to get information - for the methods
  Data.findByIdAndDelete(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//post method
router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUT",
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//api request
app.use("/api", router);

//app listen
app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));
