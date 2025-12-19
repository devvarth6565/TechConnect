const mongoose = require('mongoose');


const ConnectDB = async()=>{
    await mongoose.connect("mongodb+srv://devvarthsingh69_db_user:3jxMYsxfF5qnKZ8D@techconnect.ztpwk34.mongodb.net/?appName=TechConnect") 

}



module.exports= {ConnectDB};