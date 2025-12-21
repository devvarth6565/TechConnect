const jwt = require("jsonwebtoken");
const User = require("../model/user");



const userAuth = async (req,res,next)=>{
    try{

    const {token} = req.cookies;
    if(!token){
        res.send("not authenticated");
    }
    const decodedMessage = jwt.verify(token,"devtinder");
    const user = await User.findById(decodedMessage.userId);
    if(!user){
        res.send("not authenticated")
    }
    req.user = user;
    next();

}catch(err){
    res.send("not authenticated")
}
  
}

module.exports={userAuth,};