const express = require("express");

const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(port, hostname, () => {
  console.log(`hello duongdo. i am running server at http://${hostname}:${port}`);
});
