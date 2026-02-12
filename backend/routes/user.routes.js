const userRouter = require("express").Router();
const { getCurrentUser } = require("../controllers/user.controllers");
const { isAuth } = require("../middlewares/isAuth");

userRouter.post('/getCurrentUser', isAuth, getCurrentUser)

module.exports = userRouter;