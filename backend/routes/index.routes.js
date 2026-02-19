const indexRouter = require("express").Router()
const authRouter = require("./auth.routes");
const itemRouter = require("./item.routes");
const shopRouter = require("./shop.routes");
const userRouter = require("./user.routes");

indexRouter.use("/auth", authRouter)
indexRouter.use("/user", userRouter)
indexRouter.use("/shop", shopRouter)
indexRouter.use("/item", itemRouter)

module.exports = indexRouter;