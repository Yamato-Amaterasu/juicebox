require("dotenv").config();
const PORT = 3000;
const express = require("express");
const morgan = require("morgan");
const server = express();
const { client } = require("./db");
const apiRouter = require("./api");

server.use(morgan("dev"));
server.use(express.json());

server.use((req, res, next) => {
  console.log("the body logger has started");
  console.log(req.body);
  console.log("the body logger has stopped");

  next();
});

server.use("/api", apiRouter);

client.connect();

server.listen(PORT, () => {
  console.log("the server is up on port", PORT);
});
