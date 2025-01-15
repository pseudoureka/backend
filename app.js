import express from "express";
import mongoose from "mongoose";
import Subscription from "./models/Subscription.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to DB");
});

const app = express();
app.use(express.json());
app.use(cors());

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

// GET /subscriptions
app.get(
  "https://backend-subscriptions-api.onrender.com/subscriptions",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const sortOptions = sort === "price" ? { price: "desc" } : { createdAt: "desc" };

    const subscriptions = await Subscription.find().sort(sortOptions);

    res.send(subscriptions);
  })
);

// GET /subscriptions/:id
app.get(
  "https://backend-subscriptions-api.onrender.com/subscriptions/:id",
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
  "https://backend-subscriptions-api.onrender.com/subscriptions",
  asyncHandler(async (req, res) => {
    const newSubscription = await Subscription.create(req.body);

    res.status(201).send(newSubscription);
  })
);

// PATCH /subscriptions/:id
app.patch(
  "https://backend-subscriptions-api.onrender.com/subscriptions/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findById(id);

    if (subscription) {
      Object.keys(req.body).forEach((key) => {
        subscription[key] = req.body[key];
      });
      await subscription.save();
      res.send(subscription);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

// DELETE /subscriptions/:id
app.delete(
  "https://backend-subscriptions-api.onrender.com/subscriptions/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findByIdAndDelete(id);

    if (subscription) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
