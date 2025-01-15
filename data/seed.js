import mongoose from "mongoose";
import data from "./mock.js";
import Subscription from "../models/Subscription.js";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Subscription.deleteMany({});
await Subscription.insertMany(data);

mongoose.connection.close();
