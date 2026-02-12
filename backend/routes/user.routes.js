const userRouter = require("express").Router();
const { getCurrentUser } = require("../controllers/user.controllers");
const { isAuth } = require("../middlewares/isAuth");

userRouter.get('/getCurrentUser', isAuth, getCurrentUser)

module.exports = userRouter;