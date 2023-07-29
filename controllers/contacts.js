const contacts = require("../models/contacts");
const { HttpError, ctrWrapper } = require("../helpers");

// ? прибираємо всюди try/catch - при експорті загортаємо в контроллер (підключаємо try/catch)
// ? прибираємо всі перевірки валідації - перенесені в middleware/validateBody & schemas - використовуцються в routes

const getAll = async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.status(200).json(allContacts);
};
const getById = async (req, res) => {
  const { contactId } = await req.params;
  const searchedContact = await contacts.getContactById(contactId);
  if (!searchedContact) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(searchedContact);
};
const createById = async (req, res) => {
  // // ? перевірка чи всі дані введені

  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};
const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json("contact deleted");
};
const updateById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await contacts.updateContact(contactId, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(updatedContact);
};
module.exports = {
  getAll: ctrWrapper(getAll),
  getById: ctrWrapper(getById),
  createById: ctrWrapper(createById),
  removeById: ctrWrapper(removeById),
  updateById: ctrWrapper(updateById),
};
