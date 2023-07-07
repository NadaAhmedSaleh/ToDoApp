const messages = {
  general: {
    invalidId: (field) => `Not valid ${field} id!`,
    missingInputErr: "Some required inputs are missing!",
    missingFieldErr: (field) => `${field} is missing!`,
    invalidFieldErr: (value, field) => `${value} is invalid ${field}!`,
    alreadyExistsFieldErr: (value, field) =>
      `${field} "${value}" already exists!`,
    missingUsernameAndEmailErr: "You should enter username or email to login.",
  },
  authorization: {
    missingTokenErr: "Access denied. No token provided.",
    tokenExpiredErr: "Token has expired please sign in again.",
  },
  users: {
    notMatchingPasswordsErr: "Passwords does't match please recheck!",
    passwordCriteriaErr:
      "You entered password doesn't match the following criteria:\n" +
      " 1- Password length has to be at least 8 characters.\n" +
      " 2- Password can only contain upper and lower cases english alphabet, special characters including '@ $ ! % * ? &' in addition to english numbers.\n" +
      " 3- Password should contain at least one upper case character, one lower case character, one special character and one number.\n" +
      "Please try another one.",
    userCreatedSuccess: (username) =>
      `Welcome to Nada's Todo App ${username} :)`,
    invalidCredentialsErr: "Invalid credentials!",
    wrongPasswordErr: "Entered password is not correct!",
    userNotExistsErr: (field) => `User with this ${field} doesn\'t exist!`,
    passwordUpdatedSuccess: "Password updated successfully try to login.",
  },
  toDos: {
    unauthorized: "You are unauthorized to perform this action",
    createSuccess: "Todo created successfully.",
    updateSuccess: "Todo updated successfully.",
    notFoundErr: "Todo not found!",
    alreadyDoneErr: "Todo is already done!",
    deleteSuccess: "Todo deleted successfully.",
  },
};
export default messages;
