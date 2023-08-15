const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

// ? імпортуємо клас User
const { User } = require("../models/user");

const { HttpError, ctrWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

// ? шлях для збереж аваатарок
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  // ? перед створенням юзера хешємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  // ? генеруємо тимч аватарку і додаємо посилання на неї далі для зберіг в базі
  const avatarURL = gravatar.url(email);

  // ? створ код для верифиікації юзера чи він підтверд свій емвйл, додаємо в create
  const verificationToken = nanoid();

  //* якщо юзера немає cтвор нового коритсувача
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // * після того як записали юзера в базу створ msg для підтвердження
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    // ?  при натисканні на посилання людина буде переходити за вказ адресою і отр код
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email</a>`,
  };
  // ? відпр msg кліенту для підтвердження email
  await sendEmail(verifyEmail);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = User.findOne({ email });
  if (!user) {
    throw HttpError(401, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  // * якщо юзер є і він не верифікований відпр повт msg для верифік
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    // ?  при натисканні на посилання людина буде переходити за вказ адресою і отр код
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({
    message: "Verify email resend success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password inwalid");
  }
  // ? дод перевірку на verify
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  //   ? якщо є превіряємо пароль
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  // ? якщо пароль збігається, створюємо токен
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  // ? для того щоб можна було видалити токен при разлогин, записуємо його в базу
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.status(200).json({
    name,
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  // ? видал токен
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Logout success" });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const updatedSubscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updatedSubscription) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(updatedSubscription);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  // * робимо назву файлу унікальною
  const fileName = `${_id}_${originalname}`;
  // * створ шлях де має зберіг файл + ім'я
  const resultUpload = path.join(avatarsDir, fileName);
  // * переміщ файл переіменовуючи
  await fs.rename(tmpUpload, resultUpload);
  // * запис шлях в базу
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrWrapper(register),
  verifyEmail: ctrWrapper(verifyEmail),
  resendVerifyEmail: ctrWrapper(resendVerifyEmail),
  login: ctrWrapper(login),
  getCurrent: ctrWrapper(getCurrent),
  logout: ctrWrapper(logout),
  updateSubscription: ctrWrapper(updateSubscription),
  updateAvatar: ctrWrapper(updateAvatar),
};
