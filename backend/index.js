const express = require('express');
const dbConnect = require('./config/dbConnect');
const indexRouter = require('./routes/index.routes');
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config()
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const { socketHandler } = require('./utils/socket');

const port = process.env.PORT || 4000;

const server = http.createServer(app) //converting express server into http server

const io = new Server(server, {
	cors: {
		origin: "*"
	}
})

socketHandler(io)

app.set("io", io) //set socket server in app

app.use(cookieParser());
app.use(cors({
	origin: "https://fooddelivery-1-5sdd.onrender.com",
	credentials: true
}))
app.use(express.json())
app.use("/api", indexRouter);


server.listen(port, () => {
	console.log(`app is listining on PORT ${port}`)
	dbConnect()
})