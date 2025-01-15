import mongoose from "mongoose";
import data from "./mock.js";
import Subscription from "../models/Subscription.js";
import { DATABASE_URL } from "../env.js";

mongoose.connect(DATABASE_URL);

await Subscription.deleteMany({});
await Subscription.insertMany(data);

mongoose.connection.close();
