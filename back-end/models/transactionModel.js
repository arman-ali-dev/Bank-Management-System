const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
    },
    transactionID: {
      type: String,
      unique: true,
    },
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre("save", function () {
  const time = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 100000);
  this.transactionID = `TXN-${time}-${randomNumber}`;
});

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
