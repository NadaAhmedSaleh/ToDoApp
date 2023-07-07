import * as toDosService from "../services/todos.js";

//------------------------------------------------------------------------------
const addTodo = async (req, res) => {
  const userId = req.user.id;
  const { category, requirement } = req.body;
  const { status, ...data } = await toDosService.createNewTodo(
    userId,
    category,
    requirement
  );
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const updateTodo = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { category, requirement } = req.body;
  const { status, ...data } = await toDosService.updateTodo(
    userId,
    id,
    category,
    requirement
  );
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const markDone = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status, ...data } = await toDosService.markDone(userId, id);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const getById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status, ...data } = await toDosService.getById(userId, id);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const deleteById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status, ...data } = await toDosService.deleteById(userId, id);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
export { addTodo, updateTodo, markDone, getById, deleteById };
