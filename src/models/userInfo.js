"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var userInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});
var userInfoModel = (0, mongoose_1.model)('UserInfo', userInfoSchema);
exports["default"] = userInfoModel;
