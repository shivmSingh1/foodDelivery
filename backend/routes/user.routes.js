const userRouter = require("express").Router();
const { getCurrentUser, updatedLocation } = require("../controllers/user.controllers");
const { isAuth } = require("../middlewares/isAuth");

userRouter.get('/getCurrentUser', isAuth, getCurrentUser)
userRouter.put('/updateUserLocation', isAuth, updatedLocation)

module.exports = userRouter;