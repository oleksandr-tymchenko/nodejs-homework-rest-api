const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// ? викл ф-ю схема через new
const contactSchema = new Schema(
  {
    // ? перш арг - опис об'єкту який буде зберіг  в базі: назва поля і вимога

    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,

      default: false,
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
