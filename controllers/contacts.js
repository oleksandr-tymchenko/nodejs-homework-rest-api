// const contacts = require("../models/contacts");

// ? імпортуємо клас Contact
const { Contact } = require("../models/contact");

const { HttpError, ctrWrapper } = require("../helpers");

// ! нові методи для роботи з db

const getAll = async (req, res) => {
  const allContacts = await Contact.find();
  res.status(200).json(allContacts);
};
const getById = async (req, res) => {
  const { contactId } = await req.params;
  // ! потр мідлвара для корр роботи з помилками
  const searchedContact = await Contact.findById(contactId);
  if (!searchedContact) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(searchedContact);
};
const add = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};
const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json("Contact deleted");
};
const updateById = async (req, res) => {
  const { contactId } = req.params;
  // * щоб повер об'ект з оновл даними небх додати {new: true}
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(updatedContact);
};
const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(updatedContact);
};
module.exports = {
  getAll: ctrWrapper(getAll),
  getById: ctrWrapper(getById),
  add: ctrWrapper(add),
  removeById: ctrWrapper(removeById),
  updateById: ctrWrapper(updateById),
  updateFavorite: ctrWrapper(updateFavorite),
};
