const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PasswordComplexity = require("joi-password-complexity");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Incorrect Password");

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      sub: user.email,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
      isAuthenticated: true,
    },
    process.env.JWT_KEY
  );
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: new PasswordComplexity({
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
  });
  return schema.validate(req);
}
module.exports = router;
