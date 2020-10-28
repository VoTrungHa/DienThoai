const allProducts = require("../Models/SanPham");
const DanhGia = require("../Models/DanhGia");
const NCC = require("../Models/NCC.model");
const _ = require("lodash");
const SanPham = require("../Models/SanPham");
const MucGia = require("../Models/MucGia.model");
const Ram = require("../Models/Ram.model");
const boNho = require("../Models/Bonho.model");
exports.GetAllSanPham = (req, res) => {
  allProducts.find().exec((err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Lỗi truy xuất dữ liệu", status: false });
    }
    return res.status(200).json({ data });
  });
};

exports.AddSanPham = (req, res) => {
  const product = new allProducts({
    ten: "sam sung6",
    gia: 1000000000,
    khuyenmai: 10,

    anh: "anh4.jpg",

    soluong: 2,

    lever: 3,
    manhinh: "15'ich",
    cameraT: "13PM",
    cameraS: "13PM",
    ram: "13PM",
    bonho: "13PM",
    pin: "13PM",
    thesim: "13PM",
    cpu: "13PM",

    hdh: "13PM",
    ncc: "13PM",
  });
  product.save((err, data) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ data });
  });
};

exports.DetailSanPham = (req, res) => {
  const { name, id } = req.body;
  // lấy sản phẩm theo id
  allProducts
    .findOne({ _id: id })
    .then((data) => {
      return DanhGia.findOne({ maSP: id }).then((danhgia) => {
        return { data, danhgia };
      });
    })
    .then((data) => {
      allProducts
        .find()
        .limit(3)
        .then((datas) => {
          return datas.filter((val) => {
            return (
              val.ten.toLowerCase().indexOf(`${name.replace("_", " ")}`) !== -1
            );
          });
        })
        .then((tuongtu) => {
          return res.status(200).json({ ...data, tuongtu });
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.DanhGias = (req, res) => {
  const { content, user, id, idCM } = req.body;
  const us = JSON.parse(user);
  const text = {
    body: content,
    maUser: us._id,
    anhUser: "an",
    tenUser: us.hoten,
  };
  DanhGia.findOne({ maSP: id }).then((data) => {
    if (!data) {
      const danhgia = new DanhGia();
      danhgia.maSP = id;
      danhgia.content.push(text);
      danhgia.save((err, data) => {
        if (err) {
          return res.status(401).json({ error: err });
        }
        return res.status(200).json({ status: true, data });
      });
    } else {
      var co = 0;
      data.content.map((item) => {
        if (JSON.stringify(item._id) === JSON.stringify(idCM)) {
          item.traloi.push(text);
          co = 1;
        }
      });
      if (co === 0) {
        data.content.push(text);
      }
      data.save((err, data) => {
        if (err) {
          return res.status(401).json({ error: err });
        }
        return res.status(200).json({ status: true, data });
      });
    }   
  });
};

exports.CreateNCC = (req, res) => {
  const { ten, logo } = req.body;
  const ncc = new NCC({
    ten: ten,
    logo: logo,
  });
  ncc.save();
  return;
};

exports.SearchProduts = (req, res) => {
  const { tenncc } = req.body;
  console.log(tenncc);
  SanPham.find()
    .then((data) => {
      return res.status(200).json(
        data.filter((item) => {
          return (
            item.ncc
              .toLowerCase()
              .indexOf(tenncc.toLowerCase().replace("_", " ")) !== -1
          );
        })
      );
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
// doA().then(function () { return doB()})
// .then(function () { return doC()})
// .then(function () { })

var supertSearch = {};

exports.SearchMulti = (req, res) => {
  const { tenncc } = req.body;

  supertSearch[`${tenncc.name}`] = tenncc.value;
  console.log(supertSearch);
  allProducts
    .find({ ncc: tenncc.ncc.toLowerCase() })
    .then((data) => {
      if (supertSearch.gia !== 0 && supertSearch.gia != undefined) {
        const datas= data.filter((item) => {
          return item.gia <= supertSearch.gia * 1000000 != false;
        });
         return datas!=0?datas:[];
      }
      return data;
    })
    .then((data) => {
      if(data)
      {
        if (supertSearch.bonho != 0 && supertSearch.bonho != undefined) {
          const datas= data.filter((item) => {
            return (parseInt(item.bonho) === parseInt(supertSearch.bonho)) != false;
          });
          return datas!=0?datas:[];
        }
      } 
      return data;
    })
    .then((data) => {
      if(data)
      {
        if (supertSearch.ram != 0 && supertSearch.ram != undefined) {
          const datas= data.filter((item) => {
            return (parseInt(item.ram) === parseInt(supertSearch.ram)) != false;
          });
          return datas!=0?datas:[];
        }
      } 
      return data;
    })
    .then((data) => {
      if(data)
      {
        if (supertSearch.sapxep != undefined) {
          if (supertSearch.sapxep === "asc") {
            const datas= _.sortBy(data, (e) => {
              return e.gia;
            });
            return datas!=0?datas:[];
          }
          else if(supertSearch.sapxep === "desc")
          {
            const datas= _.sortBy(data, (e) => {
              return e.gia ;
            }).reverse();
            return datas!=0?datas:[];
          }
          else
          {
            const datas= _.sortBy(data, (e) => {
              return e.link ;
            }).reverse();
            return datas!=0?datas:[];
          }
        }
      } 
      return data;
    })
    .then((data) => {
      console.log(data)
      return res.status(200).json({data})
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.allNcc = (req, res) => {
  NCC.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ data });
  });
};

/*exports.AddMucGia=(req,res)=>{
  const {min,max,gia}=req.body;
  const mg=new MucGia({
    gia,min,max
  })
  mg.save();
  return res.json({mg})
}*/
/*
exports.AddRam=(req,res)=>{
  const {body,value}=req.body;
  const mg=new Ram({
    body,value
  })
  mg.save();
  return res.json({mg})
}*/
exports.AddBoNho = (req, res) => {
  const { body, value } = req.body;
  const mg = new boNho({
    body,
    value,
  });
  mg.save();
  return res.json({ mg });
};

exports.getAllMucGia = (req, res) => {
  MucGia.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ data });
  });
};
exports.getAllBonho = (req, res) => {
  boNho.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ data });
  });
};
exports.getAllRam = (req, res) => {
  Ram.find().exec((err, data) => {
    if (err) return res.status(400).json({ error: err });
    return res.status(200).json({ data });
  });
};
