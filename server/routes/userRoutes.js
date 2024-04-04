import express from "express";
import { login, signup, tokenLogin, searchUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/tokenLogin", tokenLogin);
router.get("/search", searchUser);

export { router };
