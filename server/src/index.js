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
// const cron = require("node-cron");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
app.use(express.json());
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.DOMAIN }));
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

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.json({
    status: "failed",
  });
});

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

// function fibonacci(n) {
//   var n1 = 0, n2 = 1, n3;
//   console.log("Start");
//   console.log(n1+"\n"+n2);
//   for (let i = 2; i < n + 1; i++) {
//     n3 = n1 + n2;
//     console.log(n3);
//     n1=n2;
//     n2 = n3;
//   }
// }

// if (isMainThread) {
//   let digit = 1000;
//   let worker = new Worker(__filename, {
//     workerData: { value: digit },
//   });

//   worker.on("exit", () => {
//     console.log("Thread exiting");
//   });
//   worker.on("message", (msg) => {
//     console.log(msg);
//   });
// } else {
//   console.log(isMainThread);
//   fibonacci(workerData.value);
//   parentPort.postMessage(isMainThread);
// }

app.listen(port, () => console.log(`started https://loacalhost:${port}`));
