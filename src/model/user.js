const mongoose = require("mongoose");
const validator = require("validator");
const { default: isURL } = require("validator/lib/isURL");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



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





userSchema.methods.getJwsToken = async function ()
{
  const user = this;

  const token = jwt.sign(
    { userId: user._id },"devtinder");
    


  return token;

}

userSchema.methods.validatePassword = async function(passwordByuser){
  const user = this;

  const passwordValid = await bcrypt.compare(passwordByuser, user.password);
  return passwordValid;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
