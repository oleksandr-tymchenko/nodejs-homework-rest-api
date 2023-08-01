const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const genreList = ["fantasy", "horror", "romantic"];
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
// ? викл ф-ю схема через new
const contactSchema = new Schema(
  {
    // ? перш арг - опис об'єкту який буде зберіг  в базі: назва поля і вимога
    // ?
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    favorite: {
      type: Boolean,
      //   ? для типів булеан вимогу передаємо default
      default: false,
    },
    //   *? приклад якщо э тип genre: - необх передати знач enum - з масивом можливих значень
    genre: {
      type: String,

      enum: genreList,
      required: true,
    },
    //   ? приклад для типу data+
    date: {
      type: String,
      //   *вказуємо що має бути наступний вигляд (16-10-2023) - вказ регул вираз:
      match: dateRegexp,
      requered: true,
    },
  },
  // ? 2-м аргументом передаємо об'єкт налашт для тоо
  // ? щоб замість версіі вказувало дату оновл і дату налашт
  { versionKey: false, timestamps: true }
);

// ? для прав обр помилок при створенні додаємо middleware (оскілки монгус не видае статус помилок)
// * каже - якщо при збереженні сталася помилка, нехай спрац ця мідлвара
contactSchema.post("save", handleMongooseError);

// *переносимо схему joi в цей файл

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  date: Joi.string().pattern(dateRegexp).required(),
});

// ? створ окр схему для методу patch

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

// ? створ модель
const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
