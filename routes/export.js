const express = require("express");
const router = express.Router();
const Excel = require("exceljs");
const moment = require("moment");
const TimeClock = require("../models/Clock");

//Export excel file
router.post("/excel", async (req, res) => {
  try {
    //Get past 7 days
    dateFrom = moment().subtract(7, "d").format("MM/DD/YYYY");

    const timeClock = await TimeClock.aggregate([
      { $match: { "clockIn.date": { $gte: dateFrom } } },
    ]);

    const workbook = await new Excel.Workbook();
    // await workbook.xlsx.readFile(
    //   "export_" + moment().format("DD_MM_YYYY") + ".xlsx"
    // );
    const newworksheet = workbook.addWorksheet("My log");

    newworksheet.columns = [
      { header: "Id", key: "id", width: 10 },
      { header: "Name", key: "name", width: 32 },
      { header: "Date", key: "date", width: 15 },
      { header: "StartTime", key: "starttime", width: 15 },
      { header: "EndTime", key: "endtime", width: 15 },
      { header: "Duration", key: "duration", width: 15 },
      { header: "WorkPerformed", key: "workperformed", width: 60 },
    ];
    timeClock.map((data, index) => {
      newworksheet.addRow({
        id: index + 1,
        name: data.firstName + " " + data.lastName,
        date: data.clockIn.date,
        starttime: data.clockIn.time,
        endtime: data.clockOut.time,
        duration: data.duration,
        workperformed: data.workPerformed,
      });
    });

    // save under export.xlsx
    await workbook.xlsx.writeFile(
      "./files/excelSheets/export_" + moment().format("DD_MM_YYYY") + ".xlsx"
    );
    res.json({ msg: "Exported!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
