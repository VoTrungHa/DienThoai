const mongoose =require("mongoose");

const boNho=new mongoose.Schema({
     
    body:String,
    value:Number 
}) 
module.exports=mongoose.model("boNho",boNho);

