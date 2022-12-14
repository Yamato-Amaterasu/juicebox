const { Client } = require("pg");

const client = new Client({
  port: 5434,
  user: "yamato",
  database: "juicebox-dev",
  host: "localhost",
  password: "yamato",
});

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username
        FROM users;`
  );

  return rows;
}

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO users (username,password) VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING RETURNING *;`,
      [username, password]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
