const {ConnectDB} = require("./config/database"); 
 const bcrypt = require('bcrypt');

const User = require("./model/user");

const {signupValidator} = require("./utils/validator.js")

const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());









app.post("/signup",async(req,res)=>{

    try{
        const validationError = signupValidator(req); 

        if (validationError) {

            return res.status(400).send(validationError);
        }
    const {password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    req.body.password = hashPassword;
    console.log(req.body.password)
    const newUser = new User(req.body)

    await newUser.save();
    res.send("signed up successfully")
}
catch(err){
    console.error("Signup Crash Details:", err);
    res.status(500).send("something went wrong")
}

})






app.patch('/update/:userId',async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;



    

    try{
        const allowUpdate = ["firstName","lastName","age","gender"];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            allowUpdate.includes(k)
        )

        if(!isUpdateAllowed){
            return res.status(400).send("Update not allowed: Contains invalid fields.");
        }

        const updatedUser = await User.findOneAndUpdate({_id:userId},data,{runValidate:true})
        
    await updatedUser.save();
    res.send("user updated")

    }catch(err){
        res.status(400).send("user not updated")
    }
    



})


app.get('/feed',async(req,res)=>{
    const userEmail = req.body.email;

    try{
        const user = await User.findOne({email:userEmail})
        res.send(user)
    }catch(err){
        res.status(400).send("user not found")
    }
})

app.post('/login',
    async(req,res)=>{
        const user = new User(
            req.body
            
            // firstName:"dev",
            // lastName:"singh",
            // age:"20",
            // gender:"male",
            // email:"dev@gmail.com",
            // password:"345"

        )

        try{
            await user.save();
            res.send("user saved successfully!")

        }catch(err){

            res.status(400).send("something went wrong while saving user")



        }

       
    }
)

app.get('/admin/getData',(req,res)=>{
    res.send("fetched all data")
})

ConnectDB()
.then(()=>{
    console.log("connection to database established")
    app.listen(port,()=>{
        console.log(`serverserever is listning on port ${port} `)
    })
})
.catch((err)=>{
    console.error("not connected to database")
}
)

  


