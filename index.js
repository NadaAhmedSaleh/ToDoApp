import app from "./startup/app.js";
import initDB from "./startup/db.js";

const port = process.env.PORT || 3000;

initDB();

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
