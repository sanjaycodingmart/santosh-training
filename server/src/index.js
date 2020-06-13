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
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
const {product} = require("./routes/product")

app.use("/user", userAuth);

app.use("/user", getinfo);

app.use("/user", pendingapprovel);

app.use("/user", acceptReject);

app.use("/user", addAdmin);

app.use("/user", product);


app.listen(port, () => console.log(`started https://loacalhost:${port}`));
