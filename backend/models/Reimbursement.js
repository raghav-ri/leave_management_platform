const mongoose = require("mongoose");

const reimbursementSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Travel",
        "Food & Meals",
        "Office Supplies",
        "Medical",
        "Training & Education",
        "Internet / Phone",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reimbursement", reimbursementSchema);