//core module
const express = require("express");
const router = express.Router();
var CronJob = require("cron").CronJob;
const Sequelize = require("sequelize");

// const { timing, userrole } = require("../models/database.js");
const validuser = require("../middleware/checkvalid");
const roleCheck = require("../middleware/roleCheck");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

var interval = process.env.DEFAULT_INTERVAL;
router.post("/acceptreject", roleCheck("Admin"), async (req, res, next) => {
  const update_details = prisma.userrole.update({
    // { status: req.body.status, pendingrequest: "false" },
    // { where: { email: req.body.email } }
    data: {
      status: req.body.status,
      pendingrequest: "false",
    },
    where: { email: req.body.email },
  });
  res.json({
    status: req.body.status,
  });
});

router.post("/changeinterval", roleCheck("Admin"), async (req, res) => {
  try {
    const update_intervel = prisma.timing.update({
      // {
      //   value: interval,
      // },
      // {
      //   where: {
      //     operation: "interval",
      //   },
      // }
      data: {
        value: interval,
      },
      where: {
        operation: "interval",
      },
    });
    interval = req.query.interval;
    // console.log(interval);
    res.json({
      message: "interval successfully changed",
    });
  } catch (e) {
    res.json({
      message: "please try again and make you sure your connection!!!",
    });
  }
});

(async function findInterval() {
  try {
    const dbInterval = await prisma.timing.findOne({
      where: { operation: "interval" },
      // attributes: ["value"],
      select: {
        value: true,
      },
    });
    interval = dbInterval.value;
  } catch (e) {
    // interval = process.env.DEFAULT_INTERVAL;
  }
  // console.log(interval);
})();

var job = new CronJob(
  "0 0 0 */" + interval + " * *",
  function() {
    const reject_user = prisma.userrole.update({
      // { status: "Reject", pendingrequest: "false" },
      // {
      //   where: {
      //     doj: {
      //       [Sequelize.Op.between]: [
      //         new Date(Date.now() - interval * 24 * 3600 * 1000),
      //         new Date(Date.now()),
      //       ],
      //     },
      //     status: "pending",
      //   },
      // }
      data: {
        status: "Reject",
        pendingrequest: "false",
      },
      where: {
        doj: {
          gte: new Date(Date.now() - interval * 24 * 3600 * 1000),
          lt: new Date(Date.now()),
        },
      },
    });
    console.log("pending approvel sellers are succesfully rejected");
  },
  null,
  true
);
job.start();

module.exports = {
  acceptReject: router,
};
