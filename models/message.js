const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    chat_id: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true,
        references: { model: "chats", key: "_id" }
    },
    from_id: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true,
        references: { model: "users", key: "_id" }
    },
    attachment: {
        path: {
            type: String,
            // required: true
        },
        size: {
            type: Number,
            // required: true
        },
        // default: null
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)
module.exports = Message