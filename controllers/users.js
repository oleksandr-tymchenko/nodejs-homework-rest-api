const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

// ? імпортуємо клас User
const { User } = require("../models/user");

const { HttpError, ctrWrapper } = require("../helpers");
dotenv.config();

const { SECRET_KEY } = process.env;

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

  //* якщо юзера немає cтвор нового коритсувача
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password inwalid");
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
  login: ctrWrapper(login),
  getCurrent: ctrWrapper(getCurrent),
  logout: ctrWrapper(logout),
  updateSubscription: ctrWrapper(updateSubscription),
  updateAvatar: ctrWrapper(updateAvatar),
};
