const mongoose = require("mongoose");

const Tintuc = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true }, 
    content: [{
        img: String,body: String
    }],
    data: { type: Date, default: new Date },
    masp:{ type: String, required: true}
 
})

module.exports = mongoose.model("Tintuc", Tintuc);

