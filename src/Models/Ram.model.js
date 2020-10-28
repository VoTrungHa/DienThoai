const mongoose =require("mongoose");

const Ram=new mongoose.Schema({
     
    body:String,
    value:Number 
}) 
module.exports=mongoose.model("Ram",Ram);

