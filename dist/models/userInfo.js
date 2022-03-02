"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});
const userInfoModel = (0, mongoose_1.model)('UserInfo', userInfoSchema);
exports.default = userInfoModel;
