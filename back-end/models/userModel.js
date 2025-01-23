const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pin: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) {
    return next(); // Skip hashing if pin is not modified
  }

  const SALT = await bcrypt.genSalt(10);
  const hashedPin = await bcrypt.hash(this.pin, SALT);

  this.pin = hashedPin;
  next();
});

userSchema.static("matchaPassword", async function (account_number, pin) {
  const user = await this.findOne({ accountNumber: account_number });

  if (!user) return null;

  const result = await bcrypt.compare(pin, user.pin);

  if (result) return user;
  else return { isInvalidPin: true };
});

userSchema.methods.generateToken = function () {
  const token = JWT.sign(
    {
      _id: this._id,
      mobileNumber: this.mobileNumber,
    },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );

  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
