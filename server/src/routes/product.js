//core module
const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const validuser = require("../middleware/checkvalid");
const roleCheck = require("../middleware/roleCheck");

const {
  userrole,
  product,
  order,
  productReview,
} = require("../models/database");

// router.post("/sellerproduct", roleCheck("Seller"), async (req, res, next) => {
//       const dbProductList = await product.findAll({
//         where: { email: req.session.email },
//         attributes: [
//           "id",
//           "email",
//           "product_name",
//           "product_image",
//           "product_prize",
//           "product_category",
//           "product_companyname",
//           "product_warranty",
//           "product_assured",
//           "product_description",
//         ],
//       });
//       res.json({
//         productlist: dbProductList,
//       });
// });

router.post("/allproduct", async (req, res, next) => {
  const attributes = [
    "id",
    "email",
    "product_name",
    "product_image",
    "product_prize",
    "product_category",
    "product_companyname",
    "product_warranty",
    "product_assured",
    "product_description",
  ];
  var dbProductList;
  if (req.session.role == "Seller") {
    dbProductList = await product.findAll({
      where: { email: req.session.email },
      attributes: attributes,
      offset: req.query.offset,
      limit: req.query.limit,
    });
  } else {
    dbProductList = await product.findAll({
      offset: req.query.offset,
      limit: req.query.limit,
      attributes: attributes,
    });
  }
  res.json({
    productlist: dbProductList,
  });
});

router.post("/searchproduct", async (req, res, next) => {
  const dbProductList = await product.findAll({
    where: { product_name: req.body.search },
    attributes: [
      "id",
      "email",
      "product_name",
      "product_image",
      "product_prize",
      "product_category",
      "product_companyname",
      "product_warranty",
      "product_assured",
      "product_description",
    ],
  });
  res.json({
    productlist: dbProductList,
  });
});

router.post(
  "/addproduct",
  roleCheck("Seller"),
  upload.single("productimage"),
  async (req, res, next) => {
    var ProductInsert = await product.create({
      email: req.session.email,
      product_name: req.headers.productname,
      product_image: req.file.filename,
      product_prize: req.headers.productprize,
      product_category: req.headers.productcategory,
      product_companyname: req.headers.productcompanyname,
      product_warranty: req.headers.productwarranty,
      product_assured: "No assured",
      product_description: req.headers.productdescription,
    });
    const productId = await product.findOne({
      where: { product_image: req.file.filename },
      attributes: ["id"],
    });
    const dbAdminRoleList = await userrole.findAll({
      where: { role: "Admin" },
      attributes: ["email"],
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL_ID,
      subject: "Seller added product",
      text:
        "Product info : \nProduct Name : " +
        req.headers.productname +
        "\nProduct prize : " +
        req.headers.productprize +
        "\nproduct category : " +
        req.headers.productcategory +
        "\nProduct company name : " +
        req.headers.productcompanyname +
        "\nproduct warranty :  " +
        req.headers.productwarranty +
        "\nproduct description : " +
        req.headers.productdescription +
        "\n\nThe seller info : \nEmail : " +
        req.session.email +
        "\nName : " +
        req.session.name +
        "\nClick to view product : " +
        process.env.DOMAIN +
        "/product/" +
        productId.id,
    };
    try {
      for (let i = 0; i < dbAdminRoleList.length; i++) {
        // console.log(dbAdminRoleList[i].email);
        mailOptions.to = dbAdminRoleList[i].email;
        // console.log(mailOptions.text);
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              message: "Try again",
            });
          } else {
            console.log("success");
          }
        });
      }
    } catch (err) {
      res.json({
        status: "Check your connection",
      });
    }
    res.json({
      status: "success",
    });
  }
);
router.post("/deleteproduct", roleCheck("Admin"), async (req, res, next) => {
  await product.destroy({
    where: { id: req.body.id },
  });
  res.json({
    status: "success",
  });
});

router.post("/assured", roleCheck("Admin"), async (req, res, next) => {
  product.update(
    { product_assured: "Assured" },
    { where: { id: req.body.id } }
  );
  res.json({
    status: "assured",
  });
});

router.post("/placeorder", roleCheck("User"), async (req, res, next) => {
  const dbProductList = await product.findAll({
    where: { id: req.body.id },
    attributes: ["product_name", "product_prize"],
  });
  var dbInsert = await order.create({
    email: req.session.email,
    product_name: dbProductList[0].product_name,
    product_prize: dbProductList[0].product_prize,
  });
  res.json({
    status: "success",
  });
});

router.post("/orders", roleCheck("User"), async (req, res, next) => {
  const dbProductList = await order.findAll({
    where: { email: req.session.email },
    attributes: ["id", "product_name", "product_prize"],
  });
  res.json({
    productlist: dbProductList,
  });
});

router.post("/getproduct", async (req, res) => {
  req.session.itemid = req.body.id;
  const dbProductList = await product.findOne({
    where: { id: req.body.id },
    attributes: [
      "email",
      "product_name",
      "product_image",
      "product_prize",
      "product_category",
      "product_companyname",
      "product_warranty",
      "product_assured",
      "product_description",
    ],
  });
  const dbProductReviewList = await productReview.findAll({
    where: { product_id: req.body.id },
    attributes: ["name", "user_comment", "user_rating"],
  });
  res.json({
    productlist: dbProductList,
    name: req.session.name,
    role: req.session.role,
    productReviewList: dbProductReviewList,
  });
});

router.post("/productreview", roleCheck("User"), async (req, res) => {
  try {
    var ProductReviewInsert = await productReview.create({
      product_id: req.body.id,
      email: req.session.email,
      name: req.session.name,
      user_comment: req.body.comment,
      user_rating: req.body.rating,
    });
    res.json({
      status: "success",
    });
  }
  catch (e) {
    console.log(e);
  }
});

router.post("/productlength", async (req, res) => {
  const productLength = await product.findAll({
    attributes: ["id"],
  });
  res.json({
    productLength: productLength.length,
  });
})

module.exports = {
  product: router,
};
