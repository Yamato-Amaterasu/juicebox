const { client } = require("../index");
const { getPostsById } = require("./getFunctions");

////////// this adds tags to the database \\\\\\\\\\
async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }
  ////////// this maps through the taglist for INSERTS  \\\\\\\\\\
  const insertValues = tagList.map((_, index) => `$${index + 1}`).join("), (");
  ////////// this maps through the taglist for SELECTS  \\\\\\\\\\
  const selectValues = tagList.map((_, index) => `$${index + 1}`).join(", ");

  try {
    ////////// this adds the tags and makes sure there are not dupes  \\\\\\\\\\
    await client.query(
      `
      INSERT INTO tags(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;`,
      tagList
    );

    ////////// this gets the tags that we added \\\\\\\\\\
    const { rows: select } = await client.query(
      `
      SELECT * FROM tags
      WHERE name
      IN (${selectValues});`,
      tagList
    );
    console.log("this is select", select);
    return select;
  } catch (error) {
    console.error(error);
  }
}

async function createPostTag(postId, tagId) {
  try {
    ////////// this gets the post id and tagid and makes a row for them  \\\\\\\\\\
    await client.query(
      `
      INSERT INTO post_tags("postId", "tagId")
      VALUES ($1, $2)
      ON CONFLICT ("postId", "tagId") DO NOTHING;`,
      [postId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

////////// this adds the tags to the posts  \\\\\\\\\\
async function addTagsToPost(postId, tagList) {
  try {
    ////////// this loops through the taglist and puts them in the createPostTag function \\\\\\\\\\
    const createPostTagPromises = tagList.map((tag) =>
      createPostTag(postId, tag.id)
    );

    await Promise.all(createPostTagPromises);

    return await getPostsById(postId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTags,
  createPostTag,
  addTagsToPost,
};
