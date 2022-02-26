"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.deactivate = exports.update = exports.add = exports.view = exports.ensureToken = exports.login = exports.signup = void 0;
var bcrypt = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var user_1 = require("../models/user");
var userInfo_1 = require("../models/userInfo");
var signup = function (req, res) {
    user_1["default"].find({ email: req.body.email }).exec()
        .then(function (user) {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'mail already exists'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10).then(function (hash) {
                user_1["default"].create({ email: req.body.email, password: hash, role: "basic", active: true })
                    .then(function () {
                    res.send("User Registered");
                })["catch"](function (err) {
                    if (err) {
                        res.sendStatus(400).json({ error: err });
                    }
                });
            });
        }
    });
};
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, pass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1["default"].findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (user && user.active == true) {
                    pass = req.body.password;
                    bcrypt.compare(pass, user.password).then(function (match) {
                        if (!match) {
                            res.sendStatus(400).json({ error: "wrong password" });
                        }
                        else {
                            var accessToken = generateToken(user);
                            res.json({ accessToken: accessToken, id: user._id });
                        }
                    });
                }
                else {
                    res.send("Mail not registered");
                }
                return [2 /*return*/];
        }
    });
}); };
exports.login = login;
function generateToken(user) {
    return jsonwebtoken_1["default"].sign(user, "my_secret_key");
}
function ensureToken(req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401).json({ error: "Not Authenticated" });
    }
    jsonwebtoken_1["default"].verify(token, "my_secret_key", function (err, data) {
        if (err) {
            return res.sendStatus(403);
        }
        else {
            req.user = data;
            next();
        }
    });
}
exports.ensureToken = ensureToken;
var view = function (req, res) {
    if (req.user.role == "admin") {
        userInfo_1["default"].find().then(function (p) {
            console.log(p);
        })["catch"](function (error) {
            console.log(error);
        });
    }
};
exports.view = view;
var add = function (req, res) {
    if (req.user.role == "basic" && req.user.active == true && req.user._id == req.params.id) {
        userInfo_1["default"].create(req.body).then(function () {
            res.send("User Info created");
        });
    }
    else {
        res.send("Cannot add info");
    }
};
exports.add = add;
var update = function (req, res) {
    if (req.user.role == "basic" && req.user.active == true && req.user._id == req.params.id) {
        //userInfoModel.name=req.body.name;
        var user_data_1 = new userInfo_1["default"]({ _id: req.params.id, name: req.body.name, address: req.body.address });
        user_data_1.save().then(function () {
            res.json({ user_data: user_data_1 });
        })["catch"](function (error) {
            res.json(error);
        });
    }
    else {
        res.send("Cannot update info");
    }
};
exports.update = update;
var deactivate = function (req, res) {
    if (req.user.role == "admin") {
        user_1["default"].findOne({ _id: req.params.id }, function (err, user) {
            user.active = false;
        });
    }
};
exports.deactivate = deactivate;
