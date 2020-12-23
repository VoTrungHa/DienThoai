const mongoose =require("mongoose");

const CTdonhang=new mongoose.Schema({
   madonhang:{type:String,required:true},
   sanpham:[
       {
           masp:{type:String,required:true},
            
           tensp:{type:String,required:true},
           soluong:{type:Number,required:true},
           gia:{type:Number,required:true},
           tonggia:{type:Number,required:true},
       }
   ],
     
}) 
module.exports=mongoose.model("CTdonhang",CTdonhang);

