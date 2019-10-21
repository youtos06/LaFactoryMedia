const jwt = require("jsonwebtoken");
const privateKey = require("../config/default.json");

module.exports = function(req, res, next) {
  try {
    const decoded = jwt.verify(req.params.jwt, privateKey.jwtPrivateKey);
    req.email = decoded.email;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
};
