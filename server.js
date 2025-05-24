const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
require("dotenv").config();
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
const routes = require("./routes/index")
app.use("/",routes);

const startMongoServer = require("./config/connection")
startMongoServer();

const { intiSocket } = require("./socket/socket");
intiSocket(server);

server.listen(`${PORT}`, () => {
  console.log(`server is listening on port ${PORT}`);
});
