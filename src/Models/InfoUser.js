const mongoose =require("mongoose");

const InfoUser=new mongoose.Schema({
    hoten:{type:String, required:true, lowercase:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true}, 
    avarta:{type:String,trim:true},
    phone:{type:String,trim:false,required:true,},
    diachi:{type:String,trim:true},
   

    IDUser:{type:String,required:true,trim:true},// max tai khoan
     
})

module.exports=mongoose.model("InfoUser",InfoUser);

