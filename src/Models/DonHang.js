const mongoose =require("mongoose");

const DonHang=new mongoose.Schema({
    mak:{type:String,required:true,trim:true}, 
    manv:{type:String,required:true,trim:true},

    ngaydh:{type:Date,default:new Date,required:true}, 
    diachigh:{type:String,required:true,trim:true},
    ttthanhtoan:{type:Boolean,required:true,default:false},
    ttvanchuyen:{type:Boolean,required:true,default:false},
    tongtien:{type:Number,required:true},
     
}) 
module.exports=mongoose.model("Donhang",DonHang);

