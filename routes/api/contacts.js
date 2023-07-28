const express = require("express");

const router = express.Router();
const contacts = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  // res.json(allContacts);
  res.json({ status: "success", code: 200, data: { allContacts } });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = await req.params;
  const searchedContact = await contacts.getContactById(contactId);
  res.json({ status: "success", code: 200, data: { searchedContact } });

  // if (searchedContact !== null) res.json(searchedContact);
  // res.json({ message: "Not found" });
  // next(createError(404));
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone)
    return res.json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
  const newContact = await contacts.addContact({ name, email, phone });
  res.json({ status: "success", code: 201, data: { newContact } });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (result !== null)
    res.json({
      status: "success",
      code: 200,
      message: "contact deleted",
    });
  res.json({
    status: "error",
    code: 404,
    message: "Not found",
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone)
    return res.json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
  const updatedContact = await contacts.updateContact(contactId, {
    name,
    email,
    phone,
  });
  res.json({ status: "success", code: 200, data: { updatedContact } });
});

module.exports = router;
