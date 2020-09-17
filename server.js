const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const connectDB = require("./config/db.js");

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/clock", require("./routes/clock_handler"));
app.use("/export", require("./routes/export"));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
