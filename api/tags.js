const express = require("express");
const tagsRouter = express.Router();
const { getAllTags } = require("../db/functions/allFunctions");

tagsRouter.use((req, res, next) => {
  console.log("a request was made to /users");
  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({ tags });
});

module.exports = tagsRouter;
