const validator=require('validator');
exports.valiInfUser=(data)=>{
    
    let error={};
    if(validator.isEmpty(data.phone))
    {
        error="Điện thoại không được phép trống";
    }if(validator.isEmpty(data.hoten))
    {
        error="Họ tên không được phép trống";
    }
    if(validator.isEmpty(data.email))
    {
        error="Email không được phép trống";
    }
    if(!validator.isEmail(data.email))
    {
        error="Email không hợp lệ ! example@gmail.com";
    }if(validator.isEmpty(data.diachi))
    {
        error="Địa Chỉ không được phép trống";
    } 
    
    return {
        error,
        isValidator:Object.keys(error).length===0
    }
} 