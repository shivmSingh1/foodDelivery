const { placeOrder, getOrders } = require("../controllers/order.controllers");
const { isAuth } = require("../middlewares/isAuth");

const orderRouter = require("express").Router()

orderRouter.post("/placeOrder", isAuth, placeOrder)
orderRouter.get("/getOrders", isAuth, getOrders)

module.exports = orderRouter;