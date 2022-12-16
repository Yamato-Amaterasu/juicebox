const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePosts,
  getAllPosts,
  getUserById,
  createTags,
  addTagsToPost,
  getPostsByTagName,
} = require("./index");

async function dropTables() {
  try {
    console.log("starting to drop tables");
    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;`);
    console.log("finished dropping tables");
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables");
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
    );
     CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL, 
      active BOOLEAN DEFAULT true
     );


     CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
     );

      CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE ("postId", "tagId")
      );

    `);

    console.log("Finished building tables!");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("starting to create users");
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "moe",
      location: "louisiana",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "moe",
      location: "louisiana",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "moe",
      location: "louisiana",
    });

    console.log("finished making users");
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("this is albert", albert);

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "this is my first post. i hope i love writing blogs as much as i love writing them.",
      tags: ["#happy", "#youcandoanything"],
    });
    await createPost({
      authorId: glamgal.id,
      title: "First Post glamgal",
      content:
        "this is my first post. i hope i love writing blogs as much as i love writing them.",
      tags: ["#happy", "#worst-day-ever"],
    });
    await createPost({
      authorId: sandra.id,
      title: "First Post sandra",
      content:
        "this is my first post. i hope i love writing blogs as much as i love writing them.",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
    });
  } catch (error) {
    throw error;
  }
}

// async function createInitialTags() {
//   try {
//     console.log("starting to create tags");
//     const [happy, sad, inspo, catman] = await createTags([
//       "#happy",
//       "#worst-day-ever",
//       "#youcandoanything",
//       "#catmandoeverything",
//     ]);
//     console.log("adding tags");

//     const [postOne, postTwo, postThree] = await getAllPosts();

//     await addTagsToPost(postOne.id, [happy, inspo]);
//     await addTagsToPost(postTwo.id, [sad, inspo]);
//     await addTagsToPost(postThree.id, [happy, catman, inspo]);
//     console.log("finished making tags");
//   } catch (error) {
//     throw error;
//   }
// }

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("getting All Users");
    const users = await getAllUsers();
    // console.log("getAllUsers:", users);

    console.log("calling update on users");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("update result", updateUserResult);
    console.log("getting all posts");
    const posts = await getAllPosts();
    // console.log("posts,", posts);
    console.log("updating posts");
    const updatePostResult = await updatePosts(posts[0].id, {
      title: "new title",
      content: "updated content",
    });
    // console.log("updated post:", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");

    const updatePostTagsResult = await updatePosts(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"],
    });

    console.log("Result:", updatePostTagsResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    // console.log("Result:", albert);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
