const mongoose = require("mongoose");

const MucGia = new mongoose.Schema({
    gia:{type:String,trim:true},
    min:Number,
    max:Number
})
module.exports = mongoose.model("MucGia", MucGia);

