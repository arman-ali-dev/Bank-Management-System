require("dotenv").config();
const { connect } = require("mongoose");

const connectMongoDB = async () => {
  const connection = await connect(process.env.MONGODB_URI);
  return connection;
};

module.exports = connectMongoDB;
