//core module
const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

const validuser = require("../middleware/checkvalid");
const roleCheck = require("../middleware/roleCheck");

// const {
//   userrole,
//   product,
//   order,
//   productReview,
// } = require("../models/database");

const select_values = {
  id:true,
  email: true,
  product_name: true,
  product_image: true,
  product_prize: true,
  product_category: true,
  product_companyname: true,
  product_warranty: true,
  product_assured: true,
  product_description: true,
};

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
  // const attributes = [
  //   "id",
  //   "email",
  //   "product_name",
  //   "product_image",
  //   "product_prize",
  //   "product_category",
  //   "product_companyname",
  //   "product_warranty",
  //   "product_assured",
  //   "product_description",
  // ];
  var dbProductList;
  if (req.session.role == "Seller") {
    dbProductList = await prisma.product.findMany({
      where: { email: req.session.email },
      // attributes: attributes,
      select: {
        ...select_values
      },
      skip: req.query.offset,
      first: req.query.limit,
    });
  } else {
    dbProductList = await prisma.product.findMany({
      skip: req.query.offset,
      first: req.query.limit,
      // attributes: attributes,
      select: {
        ...select_values,
      },
    });
  }
  res.json({
    productlist: dbProductList,
  });
});

router.post("/searchproduct", async (req, res, next) => {
  const dbProductList = await prisma.product.findMany({
    where: { product_name: req.body.search },
    // attributes: [
    //   "id",
    //   "email",
    //   "product_name",
    //   "product_image",
    //   "product_prize",
    //   "product_category",
    //   "product_companyname",
    //   "product_warranty",
    //   "product_assured",
    //   "product_description",
    // ],
    select: {
      ...select_values,
    },
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
    var ProductInsert = await prisma.product.create({
      data: {
        email: req.session.email,
        product_name: req.headers.productname,
        product_image: req.file.filename,
        product_prize: req.headers.productprize,
        product_category: req.headers.productcategory,
        product_companyname: req.headers.productcompanyname,
        product_warranty: req.headers.productwarranty,
        product_assured: "No assured",
        product_description: req.headers.productdescription,
      },
    });
    const productId = await prisma.product.findOne({
      where: { product_image: req.file.filename },
      // attributes: ["id"],
      select: {
        id: true,
      },
    });
    const dbAdminRoleList = await prisma.userrole.findMany({
      where: { role: "Admin" },
      // attributes: ["email"],
      select: {
        email: true,
      },
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
        "\nClick to view product : http://localhost:4200/product/" +
        productId.id,
    };
    try {
      for (let i = 0; i < dbAdminRoleList.length; i++) {
        // console.log(dbAdminRoleList[i].email);
        mailOptions.to = dbAdminRoleList[i].email;
        // console.log(mailOptions.text);
        transporter.sendMail(mailOptions, function(error, info) {
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
  const del = await prisma.product.delete({
    where: { id: req.body.id },
  });
  res.json({
    status: "success",
  });
});

router.post("/assured", roleCheck("Admin"), async (req, res, next) => {
  const update_assurence = prisma.product.update({
    // { product_assured: "Assured" },
    // { where: { id: req.body.id } }
    data: {
      product_assured: "Assured",
    },
    where: {
      id: req.body.id,
    },
  });
  res.json({
    status: "assured",
  });
});

router.post("/placeorder", roleCheck("User"), async (req, res, next) => {
  const dbProductList = await prisma.product.findMany({
    where: { id: req.session.itemid },
    // attributes: ["product_name", "product_prize"],
    select: {
      product_name: true,
      product_prize: true,
    },
  });
  var dbInsert = await order.create({
    data: {
      email: req.session.email,
      product_name: dbProductList[0].product_name,
      product_prize: dbProductList[0].product_prize,
    },
  });
  res.json({
    status: "success",
  });
});

router.post("/orders", roleCheck("User"), async (req, res, next) => {
  const dbProductList = await prisma.orders.findMany({
    where: { email: req.session.email },
    // attributes: ["id", "product_name", "product_prize"],
    select: {
      id: true,
      product_name: true,
      product_prize: true,
    },
  });
  res.json({
    productlist: dbProductList,
  });
});

router.post("/getproduct", async (req, res) => {
  req.session.itemid = req.body.id;
  const dbProductList = await prisma.product.findOne({
    where: { id: req.body.id },
    // attributes: [
    //   "email",
    //   "product_name",
    //   "product_image",
    //   "product_prize",
    //   "product_category",
    //   "product_companyname",
    //   "product_warranty",
    //   "product_assured",
    //   "product_description",
    // ],
    select: {
      email: true,
      product_name: true,
      product_image: true,
      product_prize: true,
      product_category: true,
      product_companyname: true,
      product_warranty: true,
      product_assured: true,
      product_description: true,
    },
  });
  const dbProductReviewList = await prisma.product_review.findMany({
    where: { product_id: req.body.id },
    // attributes: ["name", "user_comment", "user_rating"],
    select: {
      name: true,
      user_comment: true,
      user_rating: true,
    },
  });
  res.json({
    productlist: dbProductList,
    name: req.session.name,
    role: req.session.role,
    productReviewList: dbProductReviewList,
  });
});

router.post("/productreview", roleCheck("User"), async (req, res) => {
  var ProductReviewInsert = await prisma.product_review.create({
    data: {
      product_id: req.body.id,
      email: req.session.email,
      name: req.session.name,
      user_comment: req.body.comment,
      user_rating: req.body.rating,
    },
  });
  res.json({
    status: "success",
  });
});

module.exports = {
  product: router,
};
