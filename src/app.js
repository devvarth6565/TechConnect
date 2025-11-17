const express = require("express");

const app = express();

const port = 3000;

app.use("/helow" ,(req,res)=>{
    res.send("hello from server")
})

app.listen(port,()=>{
    console.log(`serverserever is listning on port ${port} `)
})