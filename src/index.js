//core module
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const router = express.Router();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 4000;
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const cron = require("node-cron");
//  const {
//    Worker,
//    isMainThread,
//    parentPort,
//    workerData,
//  } = require("worker_threads");
app.use(express.json());
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.JWT_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: null,
    },
  })
);


//local module
const { userAuth } = require("./routes/userAuth");
const { getinfo } = require("./routes/getinfo");
const { pendingapprovel } = require("./routes/pendingApprovel");
const { acceptReject } = require("./routes/acceptRejectUser");
const { addAdmin } = require("./routes/addAdmin");
const { product } = require("./routes/product");

app.use("/user", userAuth);

app.use("/user", getinfo);

app.use("/user", pendingapprovel);

app.use("/user", acceptReject);

app.use("/user", addAdmin);

app.use("/user", product);


async function demo() {
  // console.log("demo");
  const ab = {
    email: true,
    name: true,
  };
  const a = await prisma.usertable.findMany({
    select: {
      ...ab
    },
  });
  console.log(a);
  // try {
  //   const user = await prisma.usertable.create({
  //     data: {
  //       email: "san@123",
  //       name: "san",
  //       password: "123",
  //     },
  //     // select: {
  //     //   name: true,
  //     //   email: true,
  //     //   password: true,
  //     //   pendingrequest: true,
  //     // },
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
}

// demo();

app.listen(port, () => console.log(`started https://loacalhost:${port}`));

