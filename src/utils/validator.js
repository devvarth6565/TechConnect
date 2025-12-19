const validator = require('validator');

const signupValidator = (req)=>{
    const{firstName,lastName,email,password}=req.body;
    if(!firstName||!lastName){
        return"name is not valid "
    }
    else if(!validator.isEmail(email)){
        return "email is not valid "
    }
    else if(!validator.isStrongPassword(password)){
        return"use strong password"
    }
    
}   

module.exports={signupValidator}