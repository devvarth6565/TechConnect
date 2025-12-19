const mongoose = require("mongoose");
const validator = require("validator");
const { default: isURL } = require("validator/lib/isURL");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    password: {
      type: String,
      required: true,
      validator(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("use strong password ");
        }
      },
    },
    photoUrl: {
      type: String,
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },
    githubUrl: {
      type: String,
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },
    linkedinUrl: {
      type: String,
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },
    bio: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!(value === "male" || value === "female" || value === "other")) {
          throw new Error("invalid gender");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
