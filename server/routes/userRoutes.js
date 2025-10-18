import express from "express";
import { getuserbyId, getUserResumes, loginuser, registeruser } from "../controllers/usercontroller.js"; // lowercase 'c'
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registeruser);
userRouter.post("/login", loginuser);
userRouter.get("/data", protect, getuserbyId);
userRouter.get("/", protect, getUserResumes);

export default userRouter;