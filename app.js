import express from "express";
import subscriptions from "./data/mock.js";

const app = express();

app.get("/subscriptions", (req, res) => {
  res.send(subscriptions);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
