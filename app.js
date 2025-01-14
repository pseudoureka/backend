import express from "express";
import mockTasks from "./data/mock.js";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Task from "./models/Task.js";

mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id" });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };

    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);

    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler((req, res) => {
    const id = Number(req.params.id);
    const task = mockTasks.find((task) => task.id === id);

    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      task.updatedAt = new Date();
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler((req, res) => {
    const id = Number(req.params.id);
    const idx = mockTasks.findIndex((task) => task.id === id);

    if (idx >= 0) {
      mockTasks.splice(idx, 1);
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
