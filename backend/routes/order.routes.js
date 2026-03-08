const { placeOrder, getOrders, getOwnerOrder, updateOrderStatus } = require("../controllers/order.controllers");
const { isAuth } = require("../middlewares/isAuth");

const orderRouter = require("express").Router()

orderRouter.post("/placeOrder", isAuth, placeOrder)
orderRouter.get("/getOrders", isAuth, getOrders)
orderRouter.get('/getOwnerOrder', isAuth, getOwnerOrder)
orderRouter.post('/updateOrderStatus', isAuth, updateOrderStatus)

module.exports = orderRouter;