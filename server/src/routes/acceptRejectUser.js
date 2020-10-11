//core module
const express = require("express");
const router = express.Router();
var CronJob = require("cron").CronJob;
const Sequelize = require("sequelize");

const { timing, userrole } = require("../models/database.js");
const validuser = require("../middleware/checkvalid");
const roleCheck = require("../middleware/roleCheck");

var interval = process.env.DEFAULT_INTERVAL;
router.post("/acceptreject", roleCheck("Admin"), async (req, res, next) => {
  userrole.update(
    { status: req.body.status, pendingrequest: "false" },
    { where: { email: req.body.email } }
  );
  res.json({
    status: req.body.status,
  });
});

router.post("/changeinterval", roleCheck("Admin"), async (req, res) => {
  try {
    timing.update(
      {
        value: interval,
      },
      {
        where: {
          operation: "interval",
        },
      }
    );
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
    const dbInterval = await timing.findOne({
      where: { operation: "interval" },
      attributes: ["value"],
    });
    interval = dbInterval.value;
  } catch (e) {
    // interval = process.env.DEFAULT_INTERVAL;
  }
  // console.log(interval);
})();

var job = new CronJob(
  "0 0 0 */" + interval + " * *",
  function () {
    userrole.update(
      { status: "Reject", pendingrequest: "false" },
      {
        where: {
          doj: {
            [Sequelize.Op.between]: [
              new Date(Date.now() - interval * 24 * 3600 * 1000),
              new Date(Date.now()),
            ],
          },
          status: "pending",
        },
      }
    );
    console.log("pending approvel sellers are succesfully rejected");
  },
  null,
  true
);
job.start();

module.exports = {
  acceptReject: router,
};
