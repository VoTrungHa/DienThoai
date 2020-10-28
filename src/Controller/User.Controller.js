const Users = require('../Models/User.model');
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const _ = require('lodash');
const nodeMailer = require('nodemailer');
const fs = require('fs')
const path = require('path');


module.exports.loginController = ((req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)
        return res.status(401).json({
            error: firstError,
        })
    }
    Users.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: [`Email không tồn tại !`] });
        }

        bcrypt.compare(password.toLowerCase(), user.password).then(function (result) {

            if (!result) {
                return res.status(401).json({
                    error: [`Mật khẩu không chính xác !`]
                })
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' })
            const us = {
                hoten: user.hoten,
                email: user.email,
                role: user.role
            }
            return res.status(200).json({
                us, token, message: "Đăng nhập thành công !"
            })
        });
    })
})


module.exports.registerController = ((req, res) => {
    const { hoten, email, password, rePassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)
        return res.status(401).json({
            error: firstError,
        })
    } else if (password !== rePassword) {
        return res.status(401).json({
            error: [`Mật khẩu phải giống nhau !`],
        })
    }
    else {
        Users.findOne({ email }).exec((err, user) => {
            if (err || user) {
                res.status(402).json({ error: [`${email} đã tồn tại !`] })
            }
            const token = jwt.sign({ hoten, email, password }, process.env.JWT_ACCOUNT_ACTIVAION, { expiresIn: '30m' })

            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
                auth: {
                    user: process.env.ADMIN_EMAIL,
                    pass: process.env.ADMIN_PASSWORD
                }
            })
            var source = fs.readFileSync(path.join("./src/views/", 'Activations.hbs'), 'utf8');// lây file html
            const templete = handlebars.compile(source); // biên dich
            const options = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Kích hoạt tài khoản tại website điện tử Phone",
                attachments: [{// thiết lập hình anh cần sử dụng trong file view
                    filename: 'viettin.png',
                    path: "public/images/viettin.png",
                    cid: 'viettin' //same cid value as in the html img src
                }
                ],
                html: templete({ url: `${process.env.URL_CLIENT}/user/activation/${token}` }),// chuyên token vào file html
            }
            return transporter.sendMail(options).then(() => {
                return res.json({
                    message: `Truy cập email ${email} để kích hoạt tài khoản !`
                })
            })
                .catch(err => {
                    return res.status(400).json({ error: err.message })
                })
        })
    }
}
)
//activation and save to database
exports.activationController = (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVAION, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: "Mã hết hạn, đăng ký lại"
                })
            }
            const { hoten, email, password } = decoded;
            console.log(password.length)
            Users.findOne({ email }).exec((err, user) => {
                if (user)// if user exists
                {
                    return res.status(400).json({
                        error: `Email ${email} đã tồn tại !`
                    })
                }
                bcrypt.hash(password, 10, function (err, hash) {
                    console.log(password)
                    console.log(hash)
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    const users = new Users({
                        hoten, email, password: hash
                    })
                    users.save((err, user) => {
                        if (err) {
                            return res.status(401).json({
                                error: err,
                            })
                        }
                        return res.json({
                            success: true,
                            message: "Đăng ký thành công !"
                        })
                    })
                });

            })
        });
    }
    else {
        return res.json({
            message: "mời nhập mã để tiếp tục"
        })
    }

}
exports.ForgetPasswod = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // bắt lỗi form input
        const firstError = errors.array().map(error => error.msg)
        return res.status(422).json({
            error: firstError
        })
    }
    Users.findOne({ email }).exec((err, user) => {// tìm kiêm email in db
        if (err || !user) {
            return res.status(404).json({ error: ["Email không tồn tại !"] })
        }
        const token = jwt.sign({// tạo token
            _id: user._id
        }, process.env.JWT_SECRET, { expiresIn: '10m' })

        // send token to email
        const sendMail = (to, subject, htmlContent) => {
            // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
                auth: {
                    user: process.env.ADMIN_EMAIL,
                    pass: process.env.ADMIN_PASSWORD
                }
            })
            var source = fs.readFileSync(path.join("./src/views/", 'ForgetPassword.hbs'), 'utf8');// lây file html
            const templete = handlebars.compile(source);// biên dihcj file
            const options = {
                from: process.env.ADMIN_EMAIL,
                to: to,
                subject: "Khôi khục mật khẩu",
                attachments: [{// thiết lập hình anh cần sử dụng trong file view
                    filename: 'viettin.png',
                    path: "public/images/viettin.png",
                    cid: 'viettin' //same cid value as in the html img src
                }
                ],
                html: templete({ url: `${process.env.URL_CLIENT}/user/repassword/${token}` }),// chuyên token vào file html
            }
            return transporter.sendMail(options).then(() => {
                return res.json({
                    message: `Truy cập email ${email} để tiến hành khôi phục mật khẩu !`
                })
            })
                .catch(err => {
                    return res.status(400).json({ error: err.message })
                })
        }

        return user.updateOne({
            resetPasswordlink: token
        }, (err, result) => {
            if (err) {
                return res.status(401).json({ error: error })
            }
            else {
                sendMail(email);
            }
        })

    })
}
exports.PasswordReset = (req, res) => {
    const { password, resetPasswordlink } = req.body;
    console.log(req.body)
    if (resetPasswordlink) {// kiểm tra tokon có tồn tại
        jwt.verify(resetPasswordlink, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(404).json({ error: ["Mã đã hết hạn ! mời thực hiện lại"] })
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const firstError = errors.array().map(error => error.msg)
                return res.status(403).json({
                    error: firstError
                })
            }
            Users.findOne({ resetPasswordlink }).exec((err, user) => {
                if (err || !user) {
                    return res.status(401).json({ error: ["Ma het han hoac khong dung. Xin thu lai"] })
                }
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    const updateField = {
                        password: hash,
                        resetPasswordlink: ""
                    }
                    user = _.extend(user, updateField)
                    user.save((err, result) => {
                        if (err) {
                            return res.status(402).json({ error: ["Thay đổi mật khẩu không thành công !"] })
                        }
                        return res.json({
                            message: "Thay đổi mật khẩu thành công !"
                        })
                    })

                });

            })
        })
    }
    else {
        return res.status(403).json({ error: [`Mã xác thực rỗng !`] })
    }
}

//login google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT, process.env.GOOGLE_SECRET);
exports.GoogleController = (req, res) => {
    const { idToken } = req.body;
    if(idToken)
    {
         
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            const { email_verified, name, email, picture } = response.payload;

            if (email_verified)// kieem tra email co ton taij
            {
                Users.findOne({ email }).exec((err, user) => {
                    if (err) { return res.status(400).json({ error: [`${err}`] }) }
                    if (user) {
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' })
                        const { _id, email, hoten, role } = user;
                        return res.status(200).json({
                            token,
                            us: { _id, email, hoten, role },
                            message: "Đăng nhập thành công !"
                        })
                    }
                    else //if email khong ton tai thi add to db
                    {
                        let password = email + process.env.JWT_SECRET;
                        const user = new Users({
                            email, password,
                            hoten: name,
                            avarta: picture
                        })
                        user.save((err, save) => {
                            if (err) {
                                return res.status(401).json({ error: [`${err}`] })
                            }
                            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' })
                            const { _id, email, hoten, role } = user;
                            return res.status(200).json({
                                token,
                                us: { _id, email, hoten, role },
                                message: "Đăng nhập thành công !"
                            })
                        })

                    }
                })
            }
            else {
                return res.status(403).json({ error: ["Google login không đúng ! thử lại"] })
            }
        })
    }
    else
    {
        return res.status(403).json({ error: ["Đừng đăng nhập Google"] })
    }
}
//login fb
exports.FacebookController = ((req, res) => {
    const { email, name, picture } = req.body.value 
    if(email)
    {
 
    Users.findOne({ email }).exec((err, user) => {
        if (err) { return res.status(400).json({ error: [`${err}`] }) }
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' })
            const { _id, email, hoten, role } = user;
            return res.status(200).json({
                token,
                us: { _id, email, hoten, role },
                message: "Đăng nhập thành công !"
            })
        }
        else //if email khong ton tai thi add to db
        {
            let password = email + process.env.JWT_SECRET;
            const user = new Users({
                email, password,
                hoten: name,
                avarta: picture.data.url
            })
            user.save((err, save) => {
                if (err) {
                    return res.status(401).json({ error: [`${err}`] })
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' })
                const { _id, email, hoten, role } = user;
                return res.status(200).json({
                    token,
                    us: { _id, email, hoten, role },
                    message: "Đăng nhập thành công !"
                })
            }) 
        }
    })
}
else
{
    return res.status(402).json({error:["Đừng đăng nhập Facebook"]})
}
})
