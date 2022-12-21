const express = require("express");
const tagsRouter = express.Router();
const {
  getAllTags,
  getPostsByTagName,
} = require("../db/functions/allFunctions");

tagsRouter.use((req, res, next) => {
  console.log("a request was made to /users");
  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({ tags });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter((post) => {
      // the post is active, doesn't matter who it belongs to
      if (post.active) {
        return true;
      }

      // the post is not active, but it belogs to the current user
      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      // none of the above are true
      return false;
    });

    console.log("--------", posts);

    if ([posts.id]) {
      res.send({ posts });
    } else {
      next({
        name: "the tag does not have a post",
        message: "thats not good",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
