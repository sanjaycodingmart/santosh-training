import path from "path";
import fs from "fs";

import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";

const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  const root = ReactDOMServer.renderToString(<App />);
  const mainFile = path.resolve("./build/index.html");
  fs.readFile(mainFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${root}</div>`)
    );
  });
});

app.use(express.static("./build"));

app.listen(PORT, () => {
  console.log("port " + PORT);
});
