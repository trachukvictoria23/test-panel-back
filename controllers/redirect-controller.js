const User = require("../models/user")
const Token = require("../models/token")

const verifyEmail = (async (req, res) => {
    const userToken = await Token.findOne({ token: req.params.token })
    if (!userToken) return redirectUserPage(req, res, 'expired')
    const user = await User.findById(req.params.id)
    if (!user || user.is_verified) return redirectUserPage(req, res, 'expired')
    user.is_verified = true
    await user.save()
    await userToken.deleteOne()
    redirectUserPage(req, res, 'email-confirmed')
})

const resetPassword = (async (req, res) => {
    const userToken = await Token.findOne({ token: req.params.token })
    if (!userToken) return redirectUserPage(req, res, 'expired')
    const user = await User.findById(req.params.id)
    if (!user) return redirectUserPage(req, res, 'expired')
    redirectUserPage(req, res, `reset-password?token=${req.params.token}&email=${user.email}`)
})

const redirectUserPage = ((req, res, route) => {
    return res.redirect(`${process.env.DOMAIN_NAME}/${route}`)
})

module.exports = {
    verifyEmail,
    resetPassword
}