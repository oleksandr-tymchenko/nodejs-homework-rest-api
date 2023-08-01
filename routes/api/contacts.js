const express = require("express");

const {
  getAll,
  getById,
  createById,
  removeById,
  updateById,
} = require("../../controllers/contacts");

const { validateBody } = require("../../middlewares");
const { addSchema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", validateBody(addSchema), createById);

router.delete("/:contactId", removeById);

router.put("/:contactId", validateBody(addSchema), updateById);

module.exports = router;
