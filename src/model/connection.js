const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const connectionSchema  = new mongoose.Schema({
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,

    },
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
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
const ConnectionSchemaModel = mongoose.model("ConnectionRequest",connectionSchema);

module.exports = ConnectionSchemaModel;