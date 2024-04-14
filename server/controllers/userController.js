import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { hash, genSalt, compare } from "bcrypt";

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: process.env.JWT_ALGORITHM,
  });
}

async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  // Check for necessary fields
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Check if user exists
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // Check if password is correct
  const match = await compare(password, user.password);
  if (!match) {
    return res.status(400).json({ msg: "Incorrect username or password" });
  }

  // Create token
  const token = generateToken(user);
  const resUser = user.toJSON();
  delete resUser.password;
  delete resUser.created_at;
  delete resUser.__v;

  return res.status(201).json({ token, user: resUser });
}

function tokenLogin(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(400).json({ msg: "Token not found" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: process.env.JWT_ALGORITHM },
    async function (err, decoded) {
      if (err) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      const resUser = user.toJSON();
      delete resUser.password;

      next();
    }
  );
}

async function signup(req, res) {
  const { f_name, l_name, username, email, password } = req.body;

  // Check for necessary fields
  if (!f_name || !username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&*_-]).{8,}/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ msg: "Password must fall under the parameters" });
  }

  // Username validation
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(400).json({ msg: "Username already taken" });
  }

  // Email validation
  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    return res.status(400).json({ msg: "Email already taken" });
  }

  // Hash password
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  // Create user
  const user = await User.create({
    f_name,
    l_name,
    username,
    email,
    password: hashedPassword,
  });

  // Create token
  const token = generateToken(user);
  const resUser = user.toJSON();
  delete resUser.password;

  return res.status(201).json({ token, user: resUser });
}

async function searchUser(req, res) {
  const { username } = req.query;
  const { user } = req.headers;

  const users = await User.find({
    username: { $regex: new RegExp(username, "i") },
  })
    .where("_id")
    .ne(user);
  if (!users) {
    return res.status(404).json({ msg: "No User found" });
  }

  const resUsers = users.map((user) => {
    const resUser = user.toJSON();
    delete resUser.password;
    delete resUser.created_at;
    delete resUser.__v;
    return resUser;
  });
  return res.status(200).json({ users: resUsers });
}

async function getUsers(req, res) {
  const arr = req.headers.users.split(",");

  // const arr = userIds.split(",");
  if (arr.length < 1) {
    res.status(400).json({ msg: "Users required" });
  }
  const users = await User.find({ _id: { $in: arr } });

  const resUsers = users.map((user) => {
    const resUser = user.toJSON();
    delete resUser.password;
    delete resUser.created_at;
    delete resUser.__v;
    return resUser;
  });
  res.json({ users: resUsers });
}

// async function updateUser(req, res) {

// }

export { login, tokenLogin, signup, searchUser, getUsers };
