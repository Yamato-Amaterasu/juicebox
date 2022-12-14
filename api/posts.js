const express = require("express");
const postsRouter = express.Router();

const {
  getAllPosts,
  createPost,
  getPostsById,
  updatePosts,
} = require("../db/functions/allFunctions");
const { post } = require("./users");
const { requireUser } = require("./utils");

postsRouter.use((req, res, next) => {
  console.log("a request was made to /posts");
  next();
});

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

postsRouter.get("/", async (req, res) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter((post) => {
      if (post.active) {
        return true;
      }

      if (req.user && post.author.id === req.user.id) {
        return true;
      }
      return false;
    });
    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }
  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostsById(postId);
    if (originalPost.author.id === req.user.id) {
      const updatePost = await updatePosts(postId, updateFields);
      res.send({ post: updatePost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getPostsById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatePost = await updatePosts(post.id, { active: false });

      res.send({ post: updatePost });
    } else {
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
