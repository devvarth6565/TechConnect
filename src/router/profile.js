const express = require('express');
const {validateProfileEdit} = require('../utils/validator');

const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{

    res.send(req.user);
    }catch(err){
        res.status(401).send("not authenticated")
    }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateProfileEdit(req)){
            throw new Error("Field cant be changed");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        res.send(

             loggedInUser
        );



    }catch(err){
        res.status(401).send("not allowed")
    }
})


module.exports = profileRouter;