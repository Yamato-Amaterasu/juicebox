const { client } = require("../index");

////////// this makes the user  \\\\\\\\\\
async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username,password,name, location) VALUES ($1, $2,$3,$4)
      ON CONFLICT (username) DO NOTHING RETURNING *;`,
      [username, password, name, location]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  ////////// this maps through the fields so we can use them to update \\\\\\\\\\
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=  ${id}
      RETURNING *;
      `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  updateUser,
};
