const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// додаємо рег вираз з https://www.w3resource.com/javascript/form/email-validation.php
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

// mongooseSchemas
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    email: {
      type: String,

      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    token: {
      type: String,
      default: "",
    },

    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: "",
      // required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleMongooseError);

// joi schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionList),
});
// * дод схему для повт відпр msg
const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const updateSubscrSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscrSchema,
  emailSchema,
};

// model
const User = model("user", userSchema);

module.exports = {
  schemas,
  User,
};
