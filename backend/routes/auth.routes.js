const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, authWithGoogle, completeProfile, authWithPhone } = require("../controllers/auth.controllers");
const { isAuth } = require("../middlewares/isAuth");

const authRouter = require("express").Router()


authRouter.post("/signup", signup);
authRouter.post("/login", signin)
authRouter.get('/logout', signout)
authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.put('/reset-password', resetPassword)
authRouter.post('/auth-google', authWithGoogle)
authRouter.post('/complete-profile', isAuth, completeProfile)
authRouter.post("/auth-phone", authWithPhone);


module.exports = authRouter;