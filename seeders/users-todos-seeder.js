import User from "../models/User.js";
import { createUser } from "../services/users.js";
import { createNewTodo, markDone } from "../services/todos.js";
import initDB from "../startup/db.js";

const addUsers = async (usersCount) => {
  console.log(`started seeding ${usersCount} users`);
  for (let i = 0; i < usersCount; i += 1) {
    const username = "username" + i;
    const email = username + "@gmail.com";
    const password = "UserPassword@" + i;
    const phoneNumber =
      "+20102" + Math.floor(1000000 + Math.random() * 9000000);
    await createUser({
      username,
      email,
      password,
      confirmPassword: password,
      phoneNumber,
    });
  }
  console.log(`finished seeding ${usersCount} users`);
};

const addToDos = async (maxToDosPerUser) => {
  const users = await User.find({});
  console.log("started adding todos to users");
  for (let i = 0; i < users.length; i += 1) {
    const userId = users[i]._id;
    const toDosCount = Math.floor(Math.random() * (maxToDosPerUser + 1));
    for (let j = 0; j < toDosCount; j += 1) {
      const { todo } = await createNewTodo(
        userId,
        "category " + j,
        "requirement text " + j
      );
      // mark random todos as done
      if (i % 2 == 0 && j % 3 === 0) {
        await markDone(userId, todo._id);
      }
    }
  }
  console.log("finished adding todos to users");
};

initDB(true);
await addUsers(4);
await addToDos(10);
