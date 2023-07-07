import * as usersService from "../services/users.js";

const signUp = async (req, res) => {
  const { status, ...data } = await usersService.createUser(req.body);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const signIn = async (req, res) => {
  const { status, ...data } = await usersService.signIn(req.body);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const authenticatedResetPassword = async (req, res) => {
  const user = { userId: req.user.id, ...req.body };
  const { status, ...data } = await usersService.resetPassword(user);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
export { signUp, signIn, authenticatedResetPassword };
