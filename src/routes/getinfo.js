//core module
const express = require("express");
const router = express.Router();

const validuser = require("../middleware/checkvalid");


router.post("/getinfo", validuser, async (req, res, next) => {
    res.json({
      name: req.session.name,
      email: req.session.email,
      role: req.session.role,
    });
});

module.exports = {
  getinfo: router,
};
