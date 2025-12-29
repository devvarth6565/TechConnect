const { ConnectDB } = require("./config/database");
const User = require("./model/user");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const requestRouter = require("./router/request.js");
const profileRouter = require("./router/profile.js");
const authRouter = require("./router/auth.js");
const userRouter = require("./router/user.js");
const cors = require("cors");
app.use(cors())
app.use(express.json());
app.use(cookieParser())



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);





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
