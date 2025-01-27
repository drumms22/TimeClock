const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  console.log("connecting....");
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    console.log("mongodb connected");
  } catch (err) {
    console.log(err.message);

    process.exit(1);
  }
};

module.exports = connectDB;
