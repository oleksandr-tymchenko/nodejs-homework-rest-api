const express = require("express");

const {
  getAll,
  getById,
  add,
  removeById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(schemas.addSchema), add);

router.delete("/:contactId", isValidId, removeById);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  updateById
);
router.patch(
  // ? після id додаємо поле, яке онвлюємо
  "/:contactId/favorite",
  isValidId,
  // ? потрібна інша схема
  validateBody(schemas.updateFavoriteSchema),
  // * свій контролер порібен
  updateFavorite
);

module.exports = router;
