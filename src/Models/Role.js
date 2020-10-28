const mongose =require('mongoose');

const Role=new mongose.Schema({
    name:{type:String, trim:true,default:"khachhang"},
    maRole:{typ:String},
})

module.exports=mongose.model("Role",Role);