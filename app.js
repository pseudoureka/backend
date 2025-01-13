import express from "express";
import tasks from "./data/mock.js";

const app = express();

app.get("/tasks", (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const compareFn =
    sort === "oldest" ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt;

  let newTasks = tasks.sort(compareFn);

  if (count) {
    newTasks = tasks.slice(0, count);
  }

  res.send(newTasks);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
