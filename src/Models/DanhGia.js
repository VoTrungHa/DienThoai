const mongoose = require("mongoose");

const DanhGia = new mongoose.Schema({
    content: [{
        body: String, 
        maUser: { type: String },
        tenUser:{type:String},
        anhUser: { type: String, default: "user.jpg" },
        thoigian:{type:Date,default:Date.now()},
        traloi: [
            {
                body: String, 
                tenUser:{type:String},
                maUser: { type: String,},
                anhUser: { type: String, default: "user.jpg" },
                thoigian:{type:Date,default:Date.now()},
            },
        ]
    }],
    maSP: { type: String,},

})
module.exports = mongoose.model("DanhGia", DanhGia);

