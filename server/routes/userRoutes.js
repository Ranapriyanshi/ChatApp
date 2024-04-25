import express from "express";
import { login, signup, tokenLogin, searchUser, getUsers, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/tokenLogin", tokenLogin);
router.put("/:id", updateUser);
router.get("/search", searchUser);
router.get("/", getUsers);

export { router };
