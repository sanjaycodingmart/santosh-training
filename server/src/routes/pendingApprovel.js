//core module
const express = require("express");
const router = express.Router();

const { users, userrole } = require("../models/database.js");
const roleCheck = require("../middleware/roleCheck");

router.post("/pendingapprovel", roleCheck("Admin"), async (req, res, next) => {
  const pendingStatus = "true";
  const dbPendingList = await userrole.findAll({
    where: { pendingrequest: pendingStatus },
    attributes: ["email"],
  });
  res.json({
    emaillist: dbPendingList,
  });
});

module.exports = {
  pendingapprovel: router,
};
