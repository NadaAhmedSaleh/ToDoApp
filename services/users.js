import config from "config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";

import messages from "../utils/messages.js";

import User from "../models/User.js";
import { regex } from "../utils/constants.js";

// supporting functions
//------------------------------------------------------------------------------
const validateAndHashPassword = async (password, confirmPassword) => {
  // check that both password and confirmPasswords strings are not empty
  if (!password) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("Password"),
    };
  }
  if (!confirmPassword) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("Confirmation password"),
    };
  }
  // check that both password and confirmation password have the same value
  if (password !== confirmPassword) {
    return {
      status: 400,
      message: messages.users.notMatchingPasswordsErr,
    };
  }
  // check that entered password matches the password criteria
  if (!new RegExp(regex.PASSWORD).test(password)) {
    return {
      status: 400,
      message: messages.users.passwordCriteriaErr,
    };
  }
  // if the entered password passed all the above checks return the hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return {
    status: 200,
    hashedPassword,
  };
};
//------------------------------------------------------------------------------
// controllers functions
//------------------------------------------------------------------------------
/**
 * Creates a new user.
 * @async
 * @param {Object} userObject
 * @param {string} userObject.username - The username of the user.
 * @param {string} userObject.email - The email address of the user.
 * @param {string} userObject.password - The password of the user.
 * @param {string} userObject.confirmPassword - The confirmation password of the user, should be the same value as password.
 * @param {string} userObject.phoneNumber - The phone number of the user.
 * @returns {Promise<{status: number, message?: string}>}
 */
const createUser = async (userObject) => {
  const { username, email, password, confirmPassword, phoneNumber } =
    userObject;
  // check that all required fields are entered
  if (!username || !email || !password || !confirmPassword) {
    return { status: 400, message: messages.general.missingInputErr };
  }
  // validate on the password here and the rest of the validations already done in the model
  const { status, message, hashedPassword } = await validateAndHashPassword(
    password,
    confirmPassword
  );
  if (status !== 200) {
    return { status, message };
  }

  // create the user and if any exception error caught in the model validation return status 400 and the err message
  const user = new User({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    tokenValidation: randtoken.uid(config.get("user.tokenValidationLength")),
  });
  try {
    await user.save();
    return {
      status: 200,
      message: messages.users.userCreatedSuccess(username),
    };
  } catch (err) {
    let errMessage = err.message;
    if (err.code === 11000) {
      // this err code is returned when try to save doc with duplicate field of one of the fields with unique property
      var field = Object.keys(err.keyValue)[0]; // which field caused the error (username, email or phone number)
      var value = err.keyValue[field];
      errMessage = messages.general.alreadyExistsFieldErr(value, field);
    }
    return {
      status: 400,
      message: errMessage,
    };
  }
};
//------------------------------------------------------------------------------
/**
 * - Verifies username/email and password.
 * - Returns user's access token on success.
 * @async
 * @param {Object} userObject
 * @param {string} [userObject.username] - The username of the user.
 * @param {string} [userObject.email] - The email address of the user.
 * @param {string} userObject.password - The password of the user.
 * @returns {Promise<{status: number, message?: string, accessToken?: string}>}
 */
const signIn = async (userObject) => {
  const { username, email, password } = userObject;
  if (!username & !email) {
    return {
      status: 400,
      message: messages.general.missingUsernameAndEmailErr,
    };
  }
  if (!password) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("Password"),
    };
  }
  const userQuery = username ? { username } : { email };
  const user = await User.findOne(userQuery);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      status: 400,
      message: messages.users.invalidCredentialsErr,
    };
  }
  //  generate the jwt token
  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
      tokenValidation: user.tokenValidation,
    },
    config.get("secrets.jwtPrivateKey"),
    { expiresIn: config.get("timers.tokenLifeSpan") }
  );
  return { status: 200, accessToken };
};
//------------------------------------------------------------------------------
/**
 * Resets the password for a logged in user.
 * @async
 * @param {Object} userInput
 * @param {string} userInput.userId - The ID of the user.
 * @param {string} userInput.oldPassword - The old password of the user.
 * @param {string} userInput.newPassword - The new password for the user.
 * @param {string} userInput.confirmPassword - The confirmation password for the new password.
 * @returns {Promise<{status: number, message?: string}>}
 */
const resetPassword = async (userInput) => {
  const { userId, oldPassword, newPassword, confirmPassword } = userInput;
  if (!userId) {
    return {
      status: 400,
      message: messages.general.missingFieldErr("User id"),
    };
  }
  const user = await User.findById(userId);
  if (!user) {
    return {
      status: 404,
      message: messages.users.userNotExistsErr("id"),
    };
  }
  // validate on the old password entered by user and the new password
  if (!oldPassword || !(await bcrypt.compare(oldPassword, user.password))) {
    return {
      status: 400,
      message: messages.users.wrongPasswordErr,
    };
  }

  // validate on the new password
  const { status, message, hashedPassword } = await validateAndHashPassword(
    newPassword,
    confirmPassword
  );
  if (status !== 200) {
    return { status, message };
  }
  // update the password and the token
  try {
    // save the new password
    user.password = hashedPassword;
    // generate new random token validation value
    const newToken = randtoken.uid(config.get("user.tokenValidationLength"));
    user.tokenValidation = newToken;
    await user.save();
    return { status: 200, message: messages.users.passwordUpdatedSuccess };
  } catch (err) {
    return { status: 400, message: err };
  }
};
//------------------------------------------------------------------------------
export { createUser, signIn, resetPassword };
