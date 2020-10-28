const Router=require('express').Router();
const{valiRegister,valiLogin,forgetpassword,Repassword} =require('../Validator/UsersValidator');
const Controller =require('../Controller/User.Controller');
const SanPhamController =require('../Controller/Sanpham.controller');
exports.InitRouterUser=(app)=>{
 
    Router.post("/user/register",valiRegister,Controller.registerController);
    Router.post("/user/activation",Controller.activationController);
    Router.post("/user/login",valiLogin,Controller.loginController);
    Router.post("/user/forgetpassword",forgetpassword,Controller.ForgetPasswod);
    Router.post("/user/repassword",Repassword,Controller.PasswordReset);
    // login google
    Router.post("/google/login",Controller.GoogleController)
    Router.post("/facebook/login",Controller.FacebookController)

// truy xuất sản phẩm trong database
    
    Router.post("/detail",SanPhamController.DetailSanPham);
    Router.post("/danhgia",SanPhamController.DanhGias);
    Router.post("/searchProduct",SanPhamController.SearchProduts);// tim kiem san phan
    Router.post("/searchMulti",SanPhamController.SearchMulti);
  
    // add 
    //Router.post("/addncc",SanPhamController.CreateNCC);
    //Router.post("/addgia",SanPhamController.AddMucGia);
     //Router.post("/addram",SanPhamController.AddRam);
    Router.post("/addbonho",SanPhamController.AddBoNho);
   

    // get All something
    Router.post("/sanpham",SanPhamController.GetAllSanPham);
    Router.post("/allNcc",SanPhamController.allNcc);
    Router.post("/mucgia",SanPhamController.getAllMucGia);
    Router.post("/bonho",SanPhamController.getAllBonho);
    Router.post("/ram",SanPhamController.getAllRam);
    return app.use("/",Router);
}