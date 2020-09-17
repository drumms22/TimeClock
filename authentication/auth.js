const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, msg: "Access denied! Please clock in!" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.timeClock = decoded.timeClock;

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      msg: "Current access not valid, please login again!",
    });
  }
};
