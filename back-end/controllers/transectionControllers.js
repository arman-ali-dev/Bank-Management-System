const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Transaction = require("../models/transactionModel");

const handleWithdraw = async (req, res) => {
  const { id, pin, amount } = req.body;

  if (!id || !pin || !amount) {
    return res.status(400).json({ msg: "all fields are required!" });
  }

  const user = await User.findById({ _id: id });

  const isPinMatch = await bcrypt.compare(pin, user.pin);

  if (!isPinMatch) {
    return res.status(401).json({ msg: "Invalid Pin!" });
  }

  if (amount > user.balance) {
    return res.status(400).json({ msg: "Check Your Current Balance!" });
  }

  try {
    user.balance -= amount;
    await user.save();

    await Transaction.create({
      accountNumber: Number(user.accountNumber),
      date: new Date().toLocaleDateString(),
      type: "Withdrawal",
      amount,
      balance: user.balance,
    });

    return res
      .status(200)
      .json({ msg: "Withdrawal Successfully!", balance: user.balance });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
};

const handleDeposit = async (req, res) => {
  const { id, pin, amount } = req.body;

  if (!id || !pin || !amount) {
    return res.status(400).json({ msg: "all fields are required!" });
  }

  const user = await User.findById({ _id: id });

  const isPinMatch = await bcrypt.compare(pin, user.pin);

  if (!isPinMatch) {
    return res.status(401).json({ msg: "Invalid Pin!" });
  }

  try {
    user.balance += Number(amount);
    await user.save();

    await Transaction.create({
      accountNumber: Number(user.accountNumber),
      date: new Date().toLocaleDateString(),
      type: "Deposit",
      amount,
      balance: user.balance,
    });
    return res
      .status(200)
      .json({ msg: "Deposit Successfully!", balance: user.balance });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
};

const handleTransfer = async (req, res) => {
  const { receiverAccountNumber, senderID, amount, pin } = req.body;

  if (!receiverAccountNumber || !senderID || !amount || !pin) {
    return res.status(400).json({ msg: "all fields are required!" });
  }

  const user = await User.findById({ _id: senderID });

  const receiverAccount = await User.findOne({
    accountNumber: receiverAccountNumber,
  });

  if (!receiverAccount || receiverAccount.accountNumber == user.accountNumber) {
    return res.status(401).json({ msg: "Invalid Account Number!" });
  }

  const isMatchPassword = await bcrypt.compare(pin, user.pin);

  if (!isMatchPassword) {
    return res.status(401).json({ msg: "Invalid Pin!" });
  }

  if (amount > user.balance) {
    return res.status(400).json({ msg: "Check Your Current Balance!" });
  }

  try {
    user.balance -= Number(amount);
    await user.save();

    await Transaction.create({
      accountNumber: Number(user.accountNumber),
      date: new Date().toLocaleDateString(),
      type: "Transfer",
      amount,
      balance: user.balance,
    });

    receiverAccount.balance += Number(amount);
    await receiverAccount.save();

    await Transaction.create({
      accountNumber: Number(receiverAccount.accountNumber),
      date: new Date().toLocaleDateString(),
      type: "Receive",
      amount,
      balance: receiverAccount.balance,
    });
    return res
      .status(200)
      .json({ msg: "Transfer Successfully!", balance: user.balance });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
};

const handleGetStatements = async (req, res) => {
  const accountNumber = req.params.accountNumber;

  const statements = await Transaction.find({ accountNumber });

  if (statements.length === 0) {
    return res.status(400).json({ msg: "No Statements" });
  }

  statements.reverse();
  return res.status(200).json({ statements });
};

module.exports = {
  handleWithdraw,
  handleDeposit,
  handleTransfer,
  handleGetStatements,
};
