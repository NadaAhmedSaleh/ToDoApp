import express from "express";
import {
  addTodo,
  updateTodo,
  markDone,
  getById,
  deleteById,
  getAll,
} from "../controllers/todos.js";

const router = express.Router();

router.post("/add", addTodo);
//-----------------------------------------------------------------------------
router.put("/update/:id", updateTodo);
//-----------------------------------------------------------------------------
router.put("/done/:id", markDone);
//-----------------------------------------------------------------------------
router.get("/getOne/:id", getById);
//-----------------------------------------------------------------------------
router.delete("/delete/:id", deleteById);
//-----------------------------------------------------------------------------
router.get("/getAll", getAll);

export default router;
