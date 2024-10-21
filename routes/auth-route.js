const express = require("express")
const router = express.Router()

const {
    logIn,
    signUp,
    resendVerification,
    resetPassword,
    updatePassword
} = require("../controllers/auth-controller")

router.post('/login', logIn)
router.post('/sign-up', signUp)
router.post('/resend-verification', resendVerification)
router.post('/reset-password', resetPassword)
router.post('/update-password', updatePassword)

module.exports = router