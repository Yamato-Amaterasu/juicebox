const { client } = require("../index");

////////// this function gets all the users info(no password) from the database  \\\\\\\\\\
async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name , location, active
          FROM users;`
  );

  return rows;
}

////////// this function gets the post when you put in the postid   \\\\\\\\\\
async function getPostsById(postId) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
        SELECT *
        FROM posts 
        WHERE id=$1;`,
      [postId]
    );

    ////////// this joins two tables and gets the accurate tags for the post that we are getting   \\\\\\\\\\
    const { rows: tags } = await client.query(
      `
        SELECT tags.*
        FROM tags
        JOIN post_tags ON tags.id=post_tags."tagId"
        WHERE post_tags."postId"=$1;`,
      [postId]
    );

    ////////// this gets the authors information  \\\\\\\\\\
    const {
      rows: [author],
    } = await client.query(
      `
        SELECT id, username, name, location
        FROM users
        WHERE id=$1;
        `,
      [post.authorId]
    );

    ////////// this "merges" the tags and author with the post and deletes the authorId from the post \\\\\\\\\\
    post.tags = tags;
    post.author = author;
    delete post.authorId;

    console.log("this is post", post);
    return post;
  } catch (error) {
    throw error;
  }
}

////////// this gets all the posts within the database \\\\\\\\\\
async function getAllPosts() {
  try {
    const { rows: postIds } = await client.query(`SELECT id FROM posts;`);
    ////////// we got the id from the line above and now we map and insert them into getPostsById \\\\\\\\\\
    const posts = await Promise.all(
      postIds.map((post) => getPostsById(post.id))
    );
    console.log(posts);

    return posts;
  } catch (error) {
    throw error;
  }
}

////////// this looks at the userId and get all the posts based on that \\\\\\\\\\
async function getPostsByUser(userId) {
  try {
    const { rows: postIds } = await client.query(`
      SELECT id FROM posts
      WHERE "authorId"=${userId};`);

    ////////// this maps throught the ids to get all the posts with all the information we would need \\\\\\\\\\
    const posts = await Promise.all(
      postIds.map((post) => getPostsById(post.id))
    );

    return posts;
  } catch (error) {
    throw error;
  }
}

////////// this gets the posts with the tagname we put into the parameter \\\\\\\\\\
async function getPostsByTagName(tagName) {
  try {
    ////////// this joins the tags and post_tags tables with posts to be able to get the posts from the tags \\\\\\\\\\
    const { rows: postIds } = await client.query(
      `
      SELECT posts.id
      FROM posts 
      JOIN post_tags ON posts.id=post_tags."postId"
      JOIN tags ON tags.id=post_tags."tagId"
      WHERE tags.name=$1
      `,
      [tagName]
    );
    ////////// this gives us the posts using the ids we got from the query above \\\\\\\\\\
    return await Promise.all(postIds.map((post) => getPostsById(post.id)));
  } catch (error) {
    throw error;
  }
}

////////// this gives us the user using only their id \\\\\\\\\\
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT * FROM users 
      WHERE id = ${userId};
      `);
    if (!user) {
      return;
    }

    ////////// this deletes the password so we dont see it and adds the users posts to user \\\\\\\\\\
    delete user.password;
    const posts = await getPostsByUser(user.id);
    user.posts = posts;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllTags() {
  const { rows } = await client.query(`
  SELECT * FROM tags
  `);

  return rows;
}

module.exports = {
  getUserById,
  getPostsById,
  getAllPosts,
  getPostsByTagName,
  getPostsByUser,
  getAllUsers,
  getAllTags,
};
