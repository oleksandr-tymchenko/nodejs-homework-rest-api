const express = require("express");
const router = express.Router();
const Joi = require("joi");

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    // res.json(allContacts);
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: "Server error" });
  }
});

// ?  пропис схему для joi -
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get(
  "/:contactId",
  async (req, res, next) => {
    try {
      const { contactId } = await req.params;
      const searchedContact = await contacts.getContactById(contactId);
      if (!searchedContact) {
        throw HttpError(404, "Not Found");
      }

      res.status(200).json(searchedContact);
    } catch (error) {
      next(error);
      // const { status = 500, message = "Server error" } = error;
      // res.status(status).json({ message });
    }
  }

  // if (searchedContact !== null) res.json(searchedContact);
  // res.json({ message: "Not found" });
  // next(createError(404));
);

router.post("/", async (req, res, next) => {
  try {
    // ? перевірка чи всі дані введені
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }

    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
    // const { status = 500, message = "Server error" } = error;
    // res.status(status).json({ message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json("contact deleted");
  } catch (error) {
    next(error);
    // const { status = 500, message = "Server error" } = error;
    // res.status(status).json({ message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const updatedContact = await contacts.updateContact(contactId, req.body);
    if (!updatedContact) {
      throw HttpError(404, "Not Found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
