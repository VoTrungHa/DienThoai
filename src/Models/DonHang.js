const mongoose =require("mongoose");

const DonHang=new mongoose.Schema({
    mak:{type:String,required:true,trim:true}, 
    manv:{type:String,trim:true},
    ttdonhang:{type:Boolean,required:true,default:false},
    ngaydh:{type:Date,default:new Date,required:true}, 
    diachigh:{type:String,required:true,trim:true},
    ttthanhtoan:{type:Boolean,required:true,default:false},
    ttvanchuyen:{type:Boolean,required:true,default:true},
    tongtien:{type:Number,required:true},
     
}) 
module.exports=mongoose.model("Donhang",DonHang);

