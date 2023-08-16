const express = require("express");
const {
  validateBody,
  authenticate,
  upload,
  resizeImg,
} = require("../../middlewares");
const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/users");
const router = express.Router();

// ? SignUp
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

// ? SignIn
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

// ? current
router.get("/current", authenticate, ctrl.getCurrent);

// ? logout
router.post("/logout", authenticate, ctrl.logout);

// ? update
router.patch(
  "/subscription",
  authenticate,
  // * потрібна інша схема
  validateBody(schemas.updateSubscrSchema),
  // * свій контролер
  ctrl.updateSubscription
);

// ? avatar
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  resizeImg,
  ctrl.updateAvatar
);

module.exports = router;
