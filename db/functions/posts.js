const { client } = require("../index");
const { createTags, addTagsToPost } = require("./tags");
const { getPostsById } = require("./getFunctions");

////////// this makes a post inside the database \\\\\\\\\\
async function createPost({ authorId, title, content, tags = [] }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      INSERT INTO posts ("authorId", title, content ) VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [authorId, title, content]
    );

    ////////// these 2 lines make the tags and add them to the post \\\\\\\\\\
    const tagList = await createTags(tags);
    return await addTagsToPost(post.id, tagList);
  } catch (error) {
    throw error;
  }
}

////////// this lets updates posts without making a new one \\\\\\\\\\
async function updatePosts(postId, fields = {}) {
  ////////// this deletes the tags from the fields so we dont map over it \\\\\\\\\\
  const { tags } = fields;
  delete fields.tags;

  ////////// this lets us map through the fields so we can use it to update \\\\\\\\\\
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    ////////// this logic makes it so that this wont run if we didnt get anything for fields \\\\\\\\\\
    if (setString.length > 0) {
      await client.query(
        `
          UPDATE posts
          SET ${setString}
          WHERE id=${postId}
          RETURNING *;
          `,
        Object.values(fields)
      );
    }
    console.log("the post is updated");

    ////////// if the post doesnt have tags then we do an early return with the post  \\\\\\\\\\
    if (tags === undefined) {
      return await getPostsById(postId);
    }

    ////////// we take the tags and map over then to create the tags \\\\\\\\\\
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");

    ////////// this deletes tags that do not have the same tagid as the taglistidstring and the post \\\\\\\\\\
    await client.query(
      `
        DELETE FROM post_tags
        WHERE "tagId"
        NOT IN (${tagListIdString})
        AND "postId"=$1;
      `,
      [postId]
    );

    ////////// this adds the tags that do match to the post  \\\\\\\\\\
    await addTagsToPost(postId, tagList);

    return await getPostsById(postId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPost,
  updatePosts,
};
