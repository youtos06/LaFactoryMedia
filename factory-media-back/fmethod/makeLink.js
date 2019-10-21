const jwt = require("jsonwebtoken");
const privateKey = require("../config/default.json");
module.exports = function(email) {
  const token = jwt.sign({ email: email }, privateKey.jwtPrivateKey, {
    expiresIn: "1h"
  });
  const url = "http://localhost:3000/forgetPassword/" + token;
  return url;
};

// create a link for password reset
