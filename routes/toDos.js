import express from "express";
import { addTodo, updateTodo, markDone } from "../controllers/todos.js";

const router = express.Router();

router.post("/add", addTodo);
//-----------------------------------------------------------------------------
router.put("/update/:id", updateTodo);
//-----------------------------------------------------------------------------
router.put("/done/:id", markDone);

export default router;
