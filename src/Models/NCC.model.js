const mongoose =require("mongoose");

const NCC=new mongoose.Schema({
    ten:{type:String, required:true},
    logo:{type:String,required:true}
     
     
}) 
module.exports=mongoose.model("NCC",NCC);

