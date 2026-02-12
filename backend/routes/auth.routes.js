const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, authWithGoogle } = require("../controllers/auth.controllers")

const authRouter = require("express").Router()


authRouter.post("/signup", signup);
authRouter.post("/login", signin)
authRouter.post('/logout', signout)
authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.put('/reset-password', resetPassword)
authRouter.post('/auth-google', authWithGoogle)


module.exports = authRouter;