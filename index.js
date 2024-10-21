const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
// const methodOverride = require('method-override')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const User = require("./models/user")

const Server = require('socket.io').Server
const { handleSocketConnection } = require("./utils/socketChat")

require('dotenv').config()


const PORT = process.env.PORT
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`

const app = express();
app.use(bodyParser.json()); // application/json - body
// app.use(express.urlencoded({ extended: false })); // forms body
app.use(express.static('public'))
app.use(cors());

//token verify
app.use((req, res, next) => {
    if ((req.url.includes('/api/auth/') && req.url !== '/api/auth/me') || req.url.includes('/api/redirects/')) {
        next()
    } else if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            async (err, payload) => {
                if (err) {
                    app.locals.user_id = null
                    res.status(401).send('Token expired!')
                    next('Token expired!')
                } else {
                    app.locals.user_id = payload.id;
                    if (req.url === '/api/auth/me') {
                        const user = await User.findById(app.locals.user_id)
                        if (!user) return res.status(500).send('Error found user')
                        // console.log('user', user)
                        res.json(user.getUserInfo(user))
                    } else {
                        next()
                    }
                }
            }
        );
    } else {
        app.locals.user_id = null
        res.status(401).send('Token expired!')
        next('Token expired!')
    }
});

const authRoutes = require('./routes/auth-route')
const usersRoutes = require('./routes/users-route')
const redirectRoutes = require('./routes/redirect-route')
const profileRoutes = require('./routes/profile-route')
const chatsRoutes = require('./routes/chats-route')

mongoose
    .connect(db)
    .then(() => console.log('Connected'))
    .catch((error) => console.log(error))

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/redirects", redirectRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/chats", chatsRoutes)

const expressServer = app.listen(PORT, (error) => {
    error ? error : console.log(`listening port ${PORT}`)
})

const io = new Server(expressServer, {
    path: `/app/${process.env.SOCKET_KEY}`,
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:8080", "http://127.0.0.1:8081"]
    }
})

io.on('connection', socket => handleSocketConnection(io, socket, app.locals.user_id))