import express from "express";
import auth from "../middleWares/auth.js";
import {
  authenticatedResetPassword,
  signIn,
  signUp,
} from "../controllers/users.js";

const router = express.Router();

router.post("/signUp", signUp);
//-----------------------------------------------------------------------------
router.post("/signIn", signIn);
//-----------------------------------------------------------------------------
router.post("/resetPasswordById", auth, authenticatedResetPassword);

export default router;
