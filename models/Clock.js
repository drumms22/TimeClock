const mongoose = require("mongoose");

const TimeClockSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  clockIn: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    actualTime: {
      type: String,
    },
  },
  clockOut: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    actualTime: {
      type: String,
    },
  },
  workPerformed: {
    type: String,
  },
  duration: {
    type: String,
  },
});

module.exports = TimeClock = mongoose.model("TimeClock", TimeClockSchema);
