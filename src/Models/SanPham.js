const mongose=require('mongoose');

const Sanpham=new mongose.Schema({
    ten:{type:String,required:true, unique: true},
    gia:{type: Number ,required:true, min:1},
    khuyenmai:{type:Number, trim:true},
    ngaynhap:{type:Date,required:true,default: Date.now},
    anh:{type:String,required:true,trim:true},
    link:{type:Number,default:0},
    soluong:{type:Number,required:true}, 

    lever:{type:Number}, 
    manhinh:{type:String,required:true,trim:true}, 
    cameraT:{type:String,required:true,trim:true},
    cameraS:{type:String,required:true,trim:true},
    ram:{type:String,required:true,trim:true},
    bonho:{type:String,required:true,trim:true},
    pin:{type:String,required:true,trim:true},
    thesim:{type:String,required:true,trim:true},
    cpu:{type:String,required:true,trim:true}, 
    thenho:{type:String,required:true,trim:true}, 

    hdh:{type:String,required:true,trim:true},
    ncc:{type:String,required:true,trim:true},


})
module.exports=mongose.model("sanpham",Sanpham);