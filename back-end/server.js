require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT;

const _dirname = path.resolve();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connectMongoDB = require("./configuration/db");
const userRoute = require("./routes/userRoute");
const transectionRoute = require("./routes/transectionRoute");

// database connection
connectMongoDB()
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch(() => console.log("MongoDB Connection Failed!"));

app.use("/user", userRoute);
app.use("/transections", transectionRoute);

app.use(express.static(path.join(_dirname, "/front-end/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "front-end", "dist", "index.html"));
});

app.listen(port, () => console.log(`Bank app listening on port ${port}!`));
