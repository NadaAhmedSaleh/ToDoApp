import mongoose from "mongoose";
import messages from "../utils/messages.js";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, messages.general.missingFieldErr("User Id")],
      index: true,
    },
    category: {
      type: String,
      minlength: 5,
      maxlength: 100,
      required: [true, messages.general.missingFieldErr("Todo category")],
    },
    requirement: {
      type: String,
      minlength: 5,
      maxlength: 500,
      required: [true, messages.general.missingFieldErr("Todo requirement")],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
