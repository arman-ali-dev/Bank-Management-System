const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const handleUserRegistration = async (req, res) => {
  try {
    const {
      account_holder_name,
      phone_number,
      pin,
      confirm_pin,
      captcha_code,
    } = req.body;

    let emptyFields = [];

    // check for missing fields
    if (!account_holder_name) emptyFields.push("account_holder_name");
    if (!phone_number) emptyFields.push("phone_number");
    if (!pin) emptyFields.push("pin");
    if (!confirm_pin) emptyFields.push("confirm_pin");
    if (!captcha_code) emptyFields.push("captcha_code");

    // If there are empty fields, return error
    if (emptyFields.length > 0) {
      return res.status(400).json({
        msg: "all fields are must be filled!",
        emptyFields,
      });
    }

    // Check if user already exists with the provided mobile number
    const isExist = await User.findOne({ phoneNumber: phone_number });
    if (isExist) {
      return res.status(400).json({
        msg: "user already exists!",
      });
    }

    // Validate pin length
    if (pin.length < 5) {
      return res.status(400).json({
        msg: "pin must have atleast 5 digit!",
      });
    }

    // Validate mobile number length (should be exactly 10 digits)
    if (phone_number.length !== 10) {
      return res.status(400).json({
        msg: "invalid mobile number!",
      });
    }

    // Check if pin and confirm_pin match
    if (pin !== confirm_pin) {
      return res.status(400).json({
        msg: "PIN and confirm PIN must be the same!",
      });
    }

    // Account number generation logic
    let digits = "1234567890";
    let accountNumber = "";

    for (let i = 0; i < 15; i++) {
      const ch = digits.charAt(Math.floor(Math.random() * digits.length));
      accountNumber += ch;
    }

    accountNumber = accountNumber.slice(0, 12);

    // Create new user in the datab
    // mase

    const newUser = await User.create({
      accountNumber: Number(accountNumber),
      name: account_holder_name,
      phoneNumber: phone_number,
      pin,
    });

    return res.status(201).json({
      user: newUser,
      token: newUser.generateToken(),
    });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { account_number, pin, captcha_code } = req.body;

    let emptyFields = [];

    // check for missing fields
    if (!account_number) emptyFields.push("account_number");
    if (!pin) emptyFields.push("pin");
    if (!captcha_code) emptyFields.push("captcha_code");

    // If there are empty fields, return error
    if (emptyFields.length > 0) {
      return res.status(401).json({
        msg: "all fields are must be filled!",
        emptyFields,
      });
    }

    // Validate account number length (should be exactly 10 digits)
    if (account_number.length !== 12) {
      return res.status(401).json({
        msg: "invalid account number!",
      });
    }

    const user = await User.matchaPassword(account_number, pin);

    if (!user) {
      return res.status(401).json({ msg: "user does not exits!" });
    }

    if (user.isInvalidPin) {
      return res.status(401).json({ msg: "Invalid Pin" });
    }

    return res.status(200).json({ user, token: user.generateToken() });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetProfile = (req, res) => {
  return res.status(200).json({ user: req.user });
};

const handleChangePin = async (req, res) => {
  const { id, pin, newPin, confirmPin } = req.body;

  const emptyFields = [];

  if (!pin) emptyFields.push("pin");
  if (!newPin) emptyFields.push("newPin");
  if (!confirmPin) emptyFields.push("confirmPin");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ msg: "all fields are required!", emptyFields });
  }

  const user = await User.findById({ _id: id });

  const isPinMatch = await bcrypt.compare(pin, user.pin);

  if (!isPinMatch) {
    return res.status(401).json({ msg: "Invalid Pin!" });
  }

  if (newPin.length < 5 || confirmPin.length < 5) {
    return res.status(400).json({ msg: "Pin must be at least 5 digits long!" });
  }

  if (newPin !== confirmPin) {
    return res
      .status(400)
      .json({ msg: "New Pin And Confirm Pin Must Be Same!" });
  }

  try {
    user.pin = newPin;
    await user.save();
    return res.status(200).json({ msg: "Pin Changed!" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
};

module.exports = {
  handleUserRegistration,
  handleUserLogin,
  handleGetProfile,
  handleChangePin,
};
