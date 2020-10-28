const {check} =require('express-validator');

exports.valiRegister=[
    check("hoten","Họ và tên không được trống").notEmpty().isLength({min:4,max:50}).withMessage('họ tên phải lớn hơn 4 ký tự !'),
    check('email',"email không được trống").notEmpty().isEmail().withMessage("email không hợp lệ ! example@gmail.com"),
    check('password',"Mật khẩu không được trống").notEmpty().isLength({min:6}).withMessage("Mật khẩu > 6 ký tự")
    .matches(/\d/).withMessage('Mật khẩu phải chứa 1 số !')
    
]
exports.valiLogin=[ 
    check('email',"email không được trống").notEmpty().isEmail().withMessage("email không hợp lệ ! example@gmail.com"),
    check('password',"Mật khẩu không được trống").notEmpty() 
]
exports.forgetpassword=[ 
    check('email',"email không được trống").notEmpty().isEmail().withMessage("email không hợp lệ ! example@gmail.com"),
     
]
exports.Repassword=[ 
    check('password',"Mật khẩu không được trống").notEmpty().isLength({min:6}).withMessage("Mật khẩu > 6 ký tự"),
]