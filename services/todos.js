import config from "config";

import Todo from "../models/ToDo.js";
import User from "../models/User.js";

import messages from "../utils/messages.js";

//------------------------------------------------------------------------------
const createNewTodo = async (userId, category, requirement) => {
  if (!category) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("Category"),
    };
  }
  if (!requirement) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("Requirement"),
    };
  }
  try {
    const todo = new Todo({
      userId,
      category,
      requirement,
    });
    await todo.save();
    return {
      status: 200,
      message: messages.toDos.createSuccess,
    };
  } catch (err) {
    return {
      status: 400,
      message: err.message,
    };
  }
};
//------------------------------------------------------------------------------
const equalIds = (id1, id2) => {
  return id1.toString() === id2.toString();
};
//------------------------------------------------------------------------------
const updateTodo = async (userId, todoId, category, requirement) => {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return {
      status: 404,
      message: messages.toDos.notFoundErr,
    };
  }
  if (!equalIds(userId, todo.userId)) {
    return {
      status: 400,
      message: messages.toDos.unauthorized,
    };
  }
  if (category) {
    todo.category = category;
  }
  if (requirement) {
    todo.requirement = requirement;
  }
  try {
    await todo.save();
    return {
      status: 200,
      message: messages.toDos.updateSuccess,
    };
  } catch (err) {
    return {
      status: 400,
      message: err.message,
    };
  }
};
//------------------------------------------------------------------------------
const markDone = async (userId, todoId) => {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return {
      status: 404,
      message: messages.toDos.notFoundErr,
    };
  }
  if (!equalIds(userId, todo.userId)) {
    return {
      status: 400,
      message: messages.toDos.unauthorized,
    };
  }
  if (todo.isDone) {
    return {
      status: 400,
      message: messages.toDos.alreadyDoneErr,
    };
  }
  try {
    todo.isDone = true;
    await todo.save();
    return {
      status: 200,
      message: messages.toDos.updateSuccess,
    };
  } catch (err) {
    return {
      status: 400,
      message: err.message,
    };
  }
};
//------------------------------------------------------------------------------
const getById = async (userId, todoId) => {
  const todo = await Todo.findOne({ _id: todoId, userId }).lean();
  if (!todo) {
    return {
      status: 404,
      message: messages.toDos.notFoundErr,
    };
  }

  return {
    status: 200,
    todo,
  };
};
//------------------------------------------------------------------------------
const deleteById = async (userId, todoId) => {
  const todo = await Todo.findById(todoId).lean();
  if (!todo) {
    return {
      status: 404,
      message: messages.toDos.notFoundErr,
    };
  }
  if (!equalIds(userId, todo.userId)) {
    return {
      status: 400,
      message: messages.toDos.unauthorized,
    };
  }

  try {
    await Todo.deleteOne({ _id: todoId });
    return {
      status: 200,
      message: messages.toDos.deleteSuccess,
    };
  } catch (err) {
    return {
      status: 400,
      message: err.message,
    };
  }
};
//------------------------------------------------------------------------------
export { createNewTodo, updateTodo, markDone, getById, deleteById };
