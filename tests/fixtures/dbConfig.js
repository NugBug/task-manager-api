const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Derek",
  email: "derek@example.com",
  password: "123456!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const setupDatabase = async () => {
  await Task.deleteMany()
  await User.deleteMany();
  await new User(userOne).save();
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}