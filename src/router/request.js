const express = require('express');
const User = require("../model/user");
const { userAuth } = require('../middleware/auth');
const ConnectionSchemaModel = require("../model/connection.js");



const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["intrested","ignored"];

        if(!(allowedStatus.includes(status))){

            return res.json({
                message:"status is invalid"
            })

        }
        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({ 
                message: "You cannot send a connection request to yourself!" 
            });
        }

        if(!(await (User.findById(toUserId)))){
            return res.json({
                message:"user not found"
            })
        }
       
        const existingConnection = await ConnectionSchemaModel.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnection) {
            return res.status(400).json({ 
                message: "Connection Request Already Exists!!" 
            });
        }

    
        const newConnection = await ConnectionSchemaModel.create({
            fromUserId,
            toUserId,
            status,
        });


        const data = await newConnection.save();
        res.send(data);


    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

requestRouter.post("/request/reivew/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;
       


        const allowedStatus = ["accepted","rejected"];
        if(!(allowedStatus.includes(status))){
            return res.json({
                message:"status is invalid"  
          })
        }

        const connectionRequest = await ConnectionSchemaModel.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"intrested"


        });

        if(!connectionRequest){
            return res.status(400).json({
                message:"connection request not found"
            })

        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({ message: "Connection request " + status, data: connectionRequest });



    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
    
})

module.exports = requestRouter;