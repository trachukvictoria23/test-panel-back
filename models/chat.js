const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chatSchema = new Schema({
    to_id: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        // references: { model: "users", key: "_id" }
    },
    from_id: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        // references: { model: "users", key: "_id" }
    },
    type: {
        type: Number,
        default: 0 // general
    },
    message: {
        type: Object,
        default: {}
    },
    is_unread: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

// chatSchema.methods.getMainInfo = (data) => {
//     return pick(data, ["_id", "createdAt", "updatedAt", ]);
// };

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat