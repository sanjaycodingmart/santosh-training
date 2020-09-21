//core module
const express = require("express");
const router = express.Router();

// const { users, userrole } = require("../models/database.js");
const roleCheck = require("../middleware/roleCheck");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/pendingapprovel", roleCheck("Admin"), async (req, res, next) => {
  const pendingStatus = "true";
  const dbPendingList = await prisma.userrole.findMany({
    where: { pendingrequest: pendingStatus },
    // attributes: ["email"],
    select: {
      email:true,
    }
  });
  res.json({
    emaillist: dbPendingList,
  });
});

module.exports = {
  pendingapprovel: router,
};
