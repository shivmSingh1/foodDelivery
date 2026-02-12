const express = require('express');
const dbConnect = require('./config/dbConnect');
const indexRouter = require('./routes/index.routes');
const app = express();
require("dotenv").config()
const cors = require("cors");

const port = process.env.PORT || 4000;

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}))
app.use(express.json())
app.use("/api", indexRouter);


app.listen(port, () => {
	console.log(`app is listining on PORT ${port}`)
	dbConnect()
})