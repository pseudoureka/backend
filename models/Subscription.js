import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    cycle: {
      type: String,
    },
    firstPaymentDate: {
      type: Date,
    },
    memo: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
