const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const connectionSchema  = new mongoose.Schema({
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",

        required: true,

    },
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,

    },
    status:{
        type:String,
        enum:{values:["intrested","ignored","accepted","rejected"],
            message:"invalid status"
        },
        required:true,
    },
},
    
   { timestamps:true,}
    
    
)
 

connectionSchema.index({fromUserId:1,toUserId:1},{unique:true});
const ConnectionSchemaModel = mongoose.model("ConnectionRequest",connectionSchema);

module.exports = ConnectionSchemaModel;