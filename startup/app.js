import express from "express";

import usersRoutes from "../routes/users.js";
import toDosRoutes from "../routes/toDos.js";

const app = express();
app.use(express.json()); // to parse request bodies

app.use("/auth", usersRoutes);
app.use("/todos", toDosRoutes);

export default app;
