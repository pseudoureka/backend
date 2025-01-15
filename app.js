import express from "express";
import mockSubscriptions from "./data/mock.js";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Subscription from "./models/Subscription.js";

mongoose.connect(DATABASE_URL).then(() => {
  console.log("Connected to DB");
});

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
        res.status(404).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// GET /subscriptions
app.get(
  "/subscriptions",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const sortOptions = sort === "price" ? { price: "desc" } : { createdAt: "desc" };

    const subscriptions = await Subscription.find().sort(sortOptions);

    res.send(subscriptions);
  })
);

// GET /subscriptions/:id
app.get(
  "/subscriptions/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findById(id);

    if (subscription) {
      res.send(subscription);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

// POST /subscriptions
app.post(
  "/subscriptions",
  asyncHandler(async (req, res) => {
    const newSubscription = await Subscription.create(req.body);

    res.status(201).send(newSubscription);
  })
);

// PATCH /subscriptions/:id
app.patch("/subscriptions/:id", (req, res) => {
  const id = Number(req.params.id);
  const subscription = mockSubscriptions.find((sub) => sub.id === id);

  if (subscription) {
    Object.keys(req.body).forEach((key) => {
      subscription[key] = req.body[key];
    });
    subscription.updatedAt = new Date();
    res.send(subscription);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

// DELETE /subscriptions/:id
app.delete("/subscriptions/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = mockSubscriptions.findIndex((sub) => sub.id === id);

  if (idx !== -1) {
    mockSubscriptions.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
