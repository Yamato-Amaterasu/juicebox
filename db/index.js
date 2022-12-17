const { Client } = require("pg");

////////// my psql doesnt trust me so i need a password to let me connect \\\\\\\\\\
const client = new Client({
  port: 5434,
  user: "yamato",
  database: "juicebox-dev",
  host: "localhost",
  password: "yamato",
});

module.exports = {
  client,
};
