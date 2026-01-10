const mongoose = require('mongoose');


const ConnectDB = async()=>{
    await mongoose.connect(process.env.DB_CONNECTION) 

}



module.exports= {ConnectDB};