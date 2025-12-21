const { ConnectDB } = require("./config/database");
const bcrypt = require("bcrypt");

const User = require("./model/user");

const { signupValidator } = require("./utils/validator.js");
const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/auth");

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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
    res.send("signed up successfully");
  } catch (err) {
    console.error("Signup Crash Details:", err);
    res.status(500).send("something went wrong");
  }
});

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const allowUpdate = ["firstName", "lastName", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowUpdate.includes(k)
    );

    if (!isUpdateAllowed) {
      return res
        .status(400)
        .send("Update not allowed: Contains invalid fields.");
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidate: true,
    });

    await updatedUser.save();
    res.send("user updated");
  } catch (err) {
    res.status(400).send("user not updated");
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("user not found");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      throw new Error("user not found");
    }

    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      throw new Error("invalid password");
    }
    const token = jwt.sign(
      { userId: validUser._id },"devtinder");
      

    res.cookie("token",token,{expires:new Date(Date.now()+36000000*12)});
    res.send("login successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});



app.get("/profile",userAuth,async(req,res)=>{
    try{

    res.send(req.user);
    }catch(err){
        res.status(401).send("not authenticated")
    }
})

app.get("/admin/getData", (req, res) => {
  res.send("fetched all data");
});

ConnectDB()
  .then(() => {
    console.log("connection to database established");
    app.listen(port, () => {
      console.log(`serverserever is listning on port ${port} `);
    });
  })
  .catch((err) => {
    console.error("not connected to database");
  });
