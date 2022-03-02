"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
        //match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    active: {
        type: Boolean
    }
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
const admin = new userModel({
    email: "admin@gmail.com",
    password: "password123",
    role: "admin",
    active: true
});
admin.save();
