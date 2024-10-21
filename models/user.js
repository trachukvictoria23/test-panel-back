const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bcrypt = require('bcryptjs');
const pick = require("lodash.pick")

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        lowercase: true,
        // max: 25
    },
    last_name: {
        type: String,
        required: true,
        lowercase: true,
    },
    full_name: {
        type: String,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        // select: false,
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
        // type: Object
    }
}, { timestamps: true })

userSchema.methods.comparePassword = async (currentPassword, hashPassword) => {
    return await bcrypt.compare(currentPassword, hashPassword);
}

userSchema.methods.getUserInfo = (data) => {
    return pick(data, ["_id", "first_name", "last_name", "full_name", "email", "role", "avatar", "is_verified", "createdAt"]);
};

const User = mongoose.model('User', userSchema)
module.exports = User