const mongoose =require("mongoose");

const UserSchame=new mongoose.Schema({
    hoten:{type:String, required:true, lowercase:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    password:{type:String,required:true,trim:true}, 
    resetPasswordlink:{
        data:String,
        default:""
    },

    role:{type:String,required:true,default:"khachhang",lowercase:true,trim:true},
     
})

module.exports=mongoose.model("User",UserSchame);

