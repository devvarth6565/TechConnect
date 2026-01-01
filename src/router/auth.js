const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");



const authRouter = express.Router();
const { signupValidator } = require("../utils/validator.js");

authRouter.patch("/forgetpassword",async(req,res)=>{
  try{
  const{email,password}=req.body;
  const validUser = await User.findOne({email:email})

  if(!validUser){
    throw new Error("user not found")
  }
  
  if(validUser){
    const resetPasswordToken = await jwt.sign(
      { newPassword: password },"devtinder",{expiresIn:5*6000});
       const decodedMessage = jwt.verify(resetPasswordToken,"devtinder");
       console.log(decodedMessage);


      const changedPasswordHash = await bcrypt.hash(decodedMessage.newPassword,10);
      validUser.password = changedPasswordHash;
      res.send("password changed successfully");
        await validUser.save();
  }
       
      
  

}catch(err){
  res.status(400).send(err.message)
}
}
)
  


authRouter.post("/signup", async (req, res) => {
    try {
      const validationError = signupValidator(req);
  
      if (validationError) {
        return res.status(400).send(validationError);
      }
      const { firstName, lastName, email, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      req.body.password = hashPassword;
      console.log(req.body.password);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
      });
  
      await newUser.save();
      res.send(newUser);
    } catch (err) {
      console.error("Signup Crash Details:", err);
      res.status(500).send("something went wrong");
    }
  });

  authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("user not found");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("invalid password");
      }
      const token = await user.getJwsToken();
      res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
  
        });
      res.send(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  authRouter.post("/logout", async (req, res) => {
    const {token} = req.cookies;
    try {
        if(token){
          res.clearCookie("token");
          res.send("logout successful");
        }
        else{
            res.send("not logged in");
        }
      
        

    }catch(err){
        res.status(400).send("something went wrong");
    }
  });

module.exports = authRouter;


