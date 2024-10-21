const User = require("../models/user")
const Token = require("../models/token")

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require("crypto");

const {
    handleError,
    handleResponse
} = require("../utils/serverMessages")
const { sendMailOptions, sendMailTypes } = require("../utils/sendMail")

const signUp = async (req, res) => {
    const { last_name, first_name, email, password, password_confirmation } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) return handleError(res, 'This email already exist!', 400)
    if (password !== password_confirmation) return handleError(res, 'Passwords not match!', 400)

    const newPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        first_name,
        last_name,
        full_name: first_name + ' ' + last_name,
        email,
        password: newPassword,
        role: 0 // user
    })
    if (!user) handleError(res, 'Error creating user')
    await sendEmail(req, user, "verify-email")
    handleResponse(res, `You have successfully registered. A verification email was sent to ${email}`)
}

const logIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return handleError(res, 'Email and password are required!', 400)
    const user = await User.findOne({ email });
    if (!user) return handleError(res, 'User with this email is not exist!', 400)
    const isMatched = await user.comparePassword(password, user.password);
    if (!isMatched) return handleError(res, 'Invalid password!', 400)
    if (!user.is_verified)
        return handleError(res, 'Your account has not verified! Please confirm your email!', 400)

    await generateToken(user, res);
}

const generateToken = async (user, res) => {
    // console.log('gen token', user)
    // const token = await user.jwtGenerateToken();
    const EXPIRE_TOKEN = 1 * 60 * 60 // 1 hour for tests
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: EXPIRE_TOKEN
    });
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + EXPIRE_TOKEN) // process.env.EXPIRE_TOKEN
    };
    res.status(200).cookie('token', token, options).json({ success: true, token })
    return token
}

const resendVerification = async (req, res) => {
    const { email } = req.body
    if (!email) console.log('No user email')
    const user = await User.findOne({ email })
    if (user.is_verified) return handleError(res, 'You already verified!')
    await sendEmail(req, user, "verify-email")
    handleResponse(res, `A verification email was resent to ${email}`)
}

const resetPassword = async (req, res) => {
    const { email } = req.body
    if (!email) console.log('No user email')
    const user = await User.findOne({ email })
    if (!user) return handleError(res, 'User with this email is not exist!')
    await sendEmail(req, user, "reset-password")
    handleResponse(res, `Check your email ${email} to reset your password!`)
}

const sendEmail = async (req, user, typeMessage) => {
    // let EXPIRE_TOKEN = 1 * 60 * 60 * 1000
    const verifyToken = await Token.create({
        user_id: user._id,
        token: crypto.randomBytes(16).toString("hex"),
        // expire_at: new Date(Date.now() + EXPIRE_TOKEN)
    });
    const transporter = nodemailer.createTransport(sendMailOptions);
    const link = `http://${req.headers.host}/api/redirects/${typeMessage}/${user._id}/${verifyToken.token}`

    await transporter.sendMail({
        from: 'support@test.com',
        // to: email, 
        to: 'laa76881@gmail.com', // email for tests
        subject: sendMailTypes[typeMessage].subject,
        html: `<h3>Dear user!</h3><p>${sendMailTypes[typeMessage].text}</p><a href="${link}" target="_blank">${link}</a>`,
    });
}

const updatePassword = async (req, res) => {
    const { token, email, password, password_confirmation } = req.body
    const userToken = await Token.findOne({ token })
    if (!userToken) return handleError(res, 'Token expired!')
    const user = await User.findOne({ email })
    if (!user) return handleError(res, 'User with this email is not exist!')
    if (password !== password_confirmation) return handleError(res, 'Passwords not match!', 400)
    const newPassword = await bcrypt.hash(password, 10)
    user.password = newPassword
    await user.save()
    await userToken.deleteOne()
    handleResponse(res, 'Your password has been updated!')
}

module.exports = {
    logIn,
    signUp,
    resendVerification,
    resetPassword,
    updatePassword
}