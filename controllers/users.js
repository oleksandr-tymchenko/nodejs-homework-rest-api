const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// ? імпортуємо клас User
const { User } = require("../models/user");

const { HttpError, ctrWrapper } = require("../helpers");
dotenv.config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  // ? перед створенням юзера хешємо пароль
  const hashPassword = await bcrypt.hash(password, 10);

  //* якщо юзера немає cтвор нового коритсувача
  const newUser = await User.create({ ...req.body, password: hashPassword });

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

module.exports = {
  register: ctrWrapper(register),
  login: ctrWrapper(login),
  getCurrent: ctrWrapper(getCurrent),
  logout: ctrWrapper(logout),
  updateSubscription: ctrWrapper(updateSubscription),
};
