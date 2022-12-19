const express = require("express");
const postsRouter = express.Router();
const { getAllPosts } = require("../db/functions/allFunctions");

postsRouter.use((req, res, next) => {
  console.log("a request was made to /posts");
  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();
  res.send({ posts });
});

module.exports = postsRouter;
