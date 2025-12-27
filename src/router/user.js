const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionSchemaModel = require('../model/connection');
const User = require('../model/user');



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


userRouter.get("/feed",userAuth,async  (req,res)=>{
    try{ 

        const page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;
        limit=(limit>50)?(limit=50):(limit);
        const skip = (page-1)*limit;


        const loggedInUser = req.user;
        const connectionRequest = await  ConnectionSchemaModel.find ({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]

        })

        const hideUser = new Set();
        connectionRequest.forEach((req)=>{
            hideUser.add(req.fromUserId);
            hideUser.add(req.toUserId);


        })

        const feedUsers = await User.find({
            $and:[
                {_id:{$ne:loggedInUser._id}},
                {_id:{$nin:Array.from(hideUser)}}]
        }).select(["firstName","lastName","age","bio","gender","githubUrl","linkedinUrl","photoUrl"])
        .skip(skip)
        .limit(limit);


        res.json({
            message:"data fetched successfully",
            data:feedUsers
        })

    
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})


module.exports = userRouter;