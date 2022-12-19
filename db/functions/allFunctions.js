////////// this file is just to make the seed page a little bit cleaner with the imports  \\\\\\\\\\

const {
  getAllUsers,
  getUserById,
  getPostsById,
  getAllPosts,
  getPostsByTagName,
  getPostsByUser,
  getAllTags,
} = require("./getFunctions");

const { createPost, updatePosts } = require("./posts");

const { createTags, createPostTag, addTagsToPost } = require("./tags");

const { createUser, updateUser } = require("./users");

module.exports = {
  getUserById,
  getPostsById,
  getAllPosts,
  getPostsByTagName,
  getPostsByUser,
  createPost,
  getAllPosts,
  getPostsByTagName,
  getPostsByUser,
  updatePosts,
  createTags,
  createPostTag,
  addTagsToPost,
  getAllUsers,
  createUser,
  updateUser,
  getAllTags,
};
