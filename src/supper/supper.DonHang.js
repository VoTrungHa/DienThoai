exports.TongDongHang=(data)=>{
    var tong=0;
    data.map((item,index)=>{
        tong =tong+(item.sl*item.gia*((100-item.khuyenmai)/100))
    })
    return tong;
}