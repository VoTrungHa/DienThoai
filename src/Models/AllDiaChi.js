const mongoose = require("mongoose");

const AllDiaChia = new mongoose.Schema({
    tinh: [{
        mat: String,
        ten: String
    }],
    huyen: [{
        mat: String,
        ten: String
    }],
    phuong: [{
        mat: String,
        ten: String
    }]


})
module.exports = mongoose.model("AllDiaChia", AllDiaChia);

