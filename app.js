const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const path = require("path");
// requiring core models
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const conn = require("./config/db");
const JsBarcode = require('jsbarcode');
const Canvas = require("canvas");
const { createCanvas } = require("canvas");
const fs = require("fs");
const associations = require("./utils/associations");
const Answer = require('./routes/answers');
const Question = require('./routes/questions');
const StudyCase = require('./routes/studyCases');
const Theme = require('./routes/themes');
const errorHandler = require("./middlewares/error");
const Metier = require('./routes/metiers');
const User = require('./routes/users');
const auth = require("./routes/auth");
const seed = require('./test/seed');
const seedAdmin = require("./utils/seedAdmin");
conn
  .authenticate()
  .then(() => console.log("Database connected".cyan.underline.bold))
  .catch(err => console.log(err));

// add {force: true} to sync properties first time

conn.sync({ alter: false}).then(async () => {
  // seed admin and his zone
  await seedAdmin();
});
associations();
app.use(express.json());
// set static folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// cors
app.use(cors());
if (process.env.NODE_ENV) {
  app.use(morgan("dev"));
}

app.use("/api/v1/answers", Answer);
app.use("/api/v1/questions", Question);
app.use("/api/v1/studycases", StudyCase);
app.use("/api/v1/themes", Theme);
app.use("/api/v1/metiers", Metier);
app.use("/api/v1/users", User);
app.use("/api/v1/auth", auth);
app.use(errorHandler);

// set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "angular")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});
const port = process.env.PORT || 5000;
app.listen(port, async () => {

  console.log(
    `app listening on port ${port} in ${process.env.NODE_ENV} mode `.yellow.bold
  );
  // await seed();
});

// Canvas v2
let canvas = createCanvas();
JsBarcode(canvas, "00000006", {
  displayValue: false,
  fontSize: 16,
  marginTop: 15,
  fontoptions: 'bold',
  width: 3,
  height: 150,
});
let buf = canvas.toBuffer();
fs.writeFileSync(path.join(__dirname, 'uploads', 'test.png'), buf);
