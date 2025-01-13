import express from "express";
import tasks from "./data/mock.js";

const app = express();

app.get("/tasks", (req, res) => {
  res.send(tasks);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
