const express = require("express");
const router = express.Router();
const moment = require("moment");
const TimeClock = require("../models/Clock");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
const auth = require("../authentication/auth");
//Clock in
router.post("/in", async (req, res) => {
  try {
    let lname = "Nicholas";
    let fname = "Drummonds";
    const timeClock = new TimeClock({
      firstName: fname,
      lastName: lname,
      clockIn: {
        date: moment().format("L"),
        time: moment().format("LTS"),
        actualTime: moment().format(),
      },
      workPerformed: "",
      clockOut: {
        date: "",
        time: "",
        actualTime: "",
      },
      duration: "",
    });

    await timeClock.save();

    const payload = {
      timeClock: {
        id: timeClock.id,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ status: 200, msg: "Clocked in!", token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

//Clock out
router.post("/out", auth, async (req, res) => {
  const { workPerformed } = req.body;

  if (workPerformed === "") {
    return res.json({ status: 401, msg: "Please enter your work performed!" });
  }

  try {
    let timeClock = await TimeClock.findById(req.timeClock.id);

    //Get start time and end time for duration
    let clockOuttime = moment().format();
    let start = moment(timeClock.clockIn.actualTime);
    let end = moment(clockOuttime);
    // calculate total duration
    let originalDuration = moment.duration(end.diff(start));
    let hour = parseInt(originalDuration.asHours());
    let mins =
      (parseFloat(originalDuration.asHours()) -
        parseInt(originalDuration.asHours())) *
      60;
    //let secs = (mins - parseInt(mins)) * 60;
    let duration;
    if (hour === 0) {
      duration = mins.toFixed(0) + " Minutes";
    } else {
      duration = hour + " Hour " + mins.toFixed(0) + " Minutes";
    }

    const fields = {
      workPerformed: workPerformed,
      clockOut: {
        date: moment().format("L"),
        time: moment().format("LTS"),
        actualTime: clockOuttime,
      },
      duration: duration,
    };

    if (timeClock.clockOut.date === "") {
      timeClock = await TimeClock.findByIdAndUpdate(
        { _id: timeClock.id },
        { $set: fields },
        { new: true }
      );
      return res.json({ status: 200, msg: "Clocked out!" });
    }

    res.json({ status: 401, msg: "You already clocked out!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

//Get all times
router.get("/all", async (req, res) => {
  try {
    //Get past 7 days
    dateFrom = moment().subtract(7, "d").format("MM/DD/YYYY");

    const timeClock = await TimeClock.aggregate([
      { $match: { "clockIn.date": { $gte: dateFrom } } },
    ]);

    res.send(timeClock);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
