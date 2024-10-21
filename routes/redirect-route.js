const express = require("express")
const router = express.Router()

const {
    verifyEmail,
    resetPassword
} = require("../controllers/redirect-controller")

router.get('/verify-email/:id/:token', verifyEmail)
router.get('/reset-password/:id/:token', resetPassword)

module.exports = router