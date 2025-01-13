import express from "express";
import subscriptions from "./data/mock.js";

const app = express();

app.get("/subscriptions", (req, res) => {
  const sort = req.query.sort;

  const compareFn =
    sort === "price" ? (a, b) => b.price - a.price : (a, b) => b.createdAt - a.createdAt;

  const newSubscriptions = subscriptions.sort(compareFn);
  res.send(newSubscriptions);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
