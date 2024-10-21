const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        references: { model: "users", key: "_id" }
    },
}, { timestamps: true })

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token