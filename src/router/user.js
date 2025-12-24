const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionSchemaModel = require('../model/connection');

const userRouter = express.Router();

userRouter.get("/user/request/received",userAuth,async (req,res)=>{
    try{
    const loggedUser = req.user;
    const connectionRequest = await ConnectionSchemaModel.find({toUserId:loggedUser._id,status:"intrested"}).populate("fromUserId",["firstName", "lastName", "age", "bio", "gender", "githubUrl", "linkedinUrl","photoUrl" ]);

    res.json({message:"data fetched successfully",data:connectionRequest})
}catch(err){
    res.status(400).send("Error : "+err.message);

}

});

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedUser = req.user;
        const connectionRequest = await ConnectionSchemaModel.find({
            $or:[
                {fromUserId:loggedUser._id,status:"accepted"},
                    {toUserId:loggedUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",["firstName", "lastName", "age", "bio", "gender", "githubUrl", "linkedinUrl","photoUrl" ]).populate("toUserId",["firstName", "lastName", "age", "bio", "gender", "githubUrl", "linkedinUrl","photoUrl" ]);

        const data = connectionRequest.map((match)=>{
            if(match.fromUserId._id.equals(loggedUser._id)){
                return match.toUserId;
            }
            else{
                return match.fromUserId;
            }
        })
        res.json({
            message:"data fetched successfully",
            data:data
        })


    }catch(err){
        res.status(400).send("Error : "+err.message);
    }}
)


module.exports = userRouter;