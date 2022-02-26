"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var posts_1 = require("./routes/posts");
var express_validator_1 = require("express-validator");
mongoose_1["default"].connect("".concat(process.env.MONGO_URI))
    .then(function () { return console.log('DB Connected'); });
mongoose_1["default"].connection.on('error', function (err) {
    console.log("DB Connection error: ".concat(err.message));
});
app.use((0, express_validator_1["default"])());
app.use("/", posts_1["default"]);
var port = 3000;
app.listen(port, function () {
    console.log("App is listening on port ".concat(port));
});
