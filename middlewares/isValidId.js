const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  // ? перевіряє чи може це бути id
  if (!isValidObjectId(contactId)) {
    // *  якщо не id в некст предаємо помилку
    next(HttpError(400, `${contactId} is not valid id`));
  }
  // * якщо все ок - йдемо далі
  next();
};

module.exports = isValidId;
