const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { User, validate } = require("../models/user");

const bcrypt = require("bcrypt");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth"); // user is connected
const admin = require("../middleware/admin");
const verifyJwt = require("../middleware/verifyJwt"); //admin
const nodemailer = require("nodemailer");
const makeLink = require("../fmethod/makeLink");
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).send(user);
});
//////mail forget nodemailer

router.post("/forgetPassword", async (req, res) => {
  const user = await User.find({ email: req.body.email });
  //console.log(user);
  if (!user) return res.status(404).send("NO User with this mail");
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "59949ee6eb31cd",
      pass: "e842ad31450956"
    }
  });

  let info = await transporter.sendMail({
    from: "Nodemailer <example@nodemailer.com>",
    to: "Nodemailer <example@nodemailer.com>",
    subject: "AMP4EMAIL message",
    text: "For clients with plaintext support only",
    html: `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Forget Password Email</title>
    </head>
    
    <body>
        <div>
            <h3>Dear {{name}},</h3>
            <p>You requested for a password reset, kindly use this <a href=${makeLink(
              req.body.email
            )}>link</a> to reset your password</p>
            <br>
            <p>Cheers!</p>
        </div>
       
    </body>
    
    </html>`
  });

  res.status(200).send("mail to recieve");
});
router.post("/forgetPassword/:jwt", verifyJwt, async (req, res) => {
  //console.log(req.body.password);
  let user = await User.findOne({ email: req.email.toString() });
  if (!user) return res.status(404).send("NO User with this email");
  //console.log(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  //console.log("------\n", user);
  const result = await user.save();
  //console.log(result);

  res.status(200).send("check your account update");
});

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find();
  for (let index = 0; index < users.length; index++) {
    users[index] = _.pick(users[index], ["_id", "name", "email", "role"]);
  }
  res.status(200).send(users);
});

router.get("/:id", [auth, admin], validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).populate("client", "name");

  if (!user) return res.status(404).send("NO User with this id");

  res.status(200).send(_.pick(user, ["_id", "name", "email", "role"]));
});

router.delete("/", [auth, admin], async (req, res) => {
  const users = await User.remove();
  res.status(200).send(users);
});

router.delete("/:id", [auth, admin], validateObjectId, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.status(200).send(user);
});

router.post("/", [auth, admin], async (req, res) => {
  //console.log("-------")
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  //console.log(req.body);
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const result = await user.save();
  // res
  //   .header("x-auth-token", token)
  //   .header("access-control-expose-headers", "x-auth-token")
  //   .send(_.pick(user, ["_id", "name", "email", "role"]));
  res.status(200).send(result._id);
});

module.exports = router;
