import express from "express";
import auth from "../middleWares/auth.js";

import usersRoutes from "../routes/users.js";
import toDosRoutes from "../routes/toDos.js";

const app = express();
app.use(express.json()); // to parse request bodies

app.use("/auth", usersRoutes);
app.use("/todos", auth, toDosRoutes);

export default app;
