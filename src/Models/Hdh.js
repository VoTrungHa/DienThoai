const mongoose =require("mongoose");

const HDH=new mongoose.Schema({
    name:{type:String, required:true,default:"android"},
    maHDH:{type:String, required:true,default:"AR"}
}) 
module.exports=mongoose.model("HDH",HDH);

