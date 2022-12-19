const express = require("express");
const usersRouter = express.Router();
const { getAllUsers } = require("../db/functions/allFunctions");

usersRouter.use((req, res, next) => {
  console.log("a request was made to /users");
  next();
});

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.send({
    users,
  });
});

module.exports = usersRouter;
