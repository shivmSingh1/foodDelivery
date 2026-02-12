const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const indexRouter = require("express").Router()

indexRouter.use("/auth", authRouter)
indexRouter.use("/user", userRouter)

module.exports = indexRouter;