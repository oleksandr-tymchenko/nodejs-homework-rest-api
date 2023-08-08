const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/users");
const router = express.Router();

// ? SignUp
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

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

module.exports = router;
