const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost } = require("../db/functions/allFunctions");
const { requireUser } = require("./utils");

postsRouter.post("/", requireUser, async (req, res, next) => {
  console.log(req.user);
  // res.send("hi");
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData.content = content;
    postData.title = title;
    postData.authorId = req.user.id;

    const post = await createPost(postData);
    console.log("-----------------------", post, "----------------------");
    if (post) {
      res.send(post);
    } else next(error);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("a request was made to /posts");
  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();
  res.send({ posts });
});

module.exports = postsRouter;
