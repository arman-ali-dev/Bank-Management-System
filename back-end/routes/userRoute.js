const { Router } = require("express");
const {
  handleUserRegistration,
  handleUserLogin,
  handleGetProfile,
  handleChangePin,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddlware");
const router = Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);

router.get("/profile", authMiddleware, handleGetProfile);
router.post("/change-pin", handleChangePin);
module.exports = router;
