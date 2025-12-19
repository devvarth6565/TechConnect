const adminAuth = (req,res,next)=>{
    const token ="xy"
    if(token==="xyz"){
        next();
    }else{
        res.status(401).send("not authenticated")
    }
}

module.exports={adminAuth,};