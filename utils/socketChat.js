// const Chat = require("../models/chat")
const {
    updateChat
} = require("../controllers/chats-controller")

const handleSocketConnection = ((io, socket) => {
    const chat_id = socket.handshake.auth.chat_id
    if (!chat_id) return;
    
    socket.join(`chat_${chat_id}`);
    // console.log('rooms', socket.rooms)

    console.log(`User ${socket.id} connected`)

    socket.on('message', data => {
        io.to(`chat_${chat_id}`).emit('message', data)
        updateChat(data)
    })

    // socket.broadcast.to(`chat_${chat_id}`).emit('connected', `User ${socket.id.substring(0, 5)}} connected`)

    socket.on('disconnect', () => {
        socket.broadcast.to(`chat_${chat_id}`).emit('disconnected', `User ${socket.id.substring(0, 5)}} disconnected`)
    })

    socket.on('activity', (name) => {
        socket.broadcast.to(`chat_${chat_id}`).emit('activity', name)
    })

    socket.on('check_user_connect', () => {
        socket.broadcast.to(`chat_${chat_id}`).emit('check_user_connect')
    })

    socket.on('confirm_user_connect', () => {
        // socket.broadcast.to(`chat_${chat_id}`).emit('check_user_connect', name)
        io.to(`chat_${chat_id}`).emit('confirm_user_connect')
    })
})

module.exports = {
    handleSocketConnection
}