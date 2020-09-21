const jwt = require("jsonwebtoken");
const session = require("express-session");
// const jwtKey = process.env.JWT_KEY; //my_secret_key
module.exports = (req, res, next) => {
  try {
    if (req.session.name) {
      next();
    }
  } catch (e) {
    return res.json({
      message: "session invalid",
    });
  }

  // try {
  //   const tokenVerify = jwt.verify(req.headers.authorization, jwtKey);
  //   // name = req.session.name;
  //   // req.data.email = req.session.email;
  //   // req.data.role = req.session.role;
  //   next();
  // } catch (e) {
  //   console.log(e);
  //   return res.status(401).json({
  //     message: "token invalid",
  //   });
  // }
};
