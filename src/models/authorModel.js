const mongoose = require("mongoose");
const validator = require("validator")

const authorModel = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    title: { type: String, enum: ["Mr", "Mrs", "Miss"], required: true },
    email: { type: String, unique: true, validate:{
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }},
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("author", authorModel);
