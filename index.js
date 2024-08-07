const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors");
const mainRoutes = require("./routes/mainRoutes");



dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use("/", mainRoutes);

app.listen(port, () => {
  console.log(`server listening on: http://localhost:${port}`);
});
