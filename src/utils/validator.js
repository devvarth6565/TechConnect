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

const validateProfileEdit = (req)=>{
    const allowedFields = ["firstName","lastName","age","gender","email","photoUrl","githubUrl","linkedinUrl","bio"];
    
    return Object.keys(req.body).every(field=>allowedFields.includes(field));

}

module.exports={signupValidator,validateProfileEdit}