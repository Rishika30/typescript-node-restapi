"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.update = exports.add = exports.view = exports.ensureToken = exports.login = exports.signup = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = __importDefault(require("../models/user"));
const userInfo_1 = __importDefault(require("../models/userInfo"));
const signup = (req, res) => {
    user_1.default.find({ email: req.body.email }).exec()
        .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'mail already exists'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10).then(hash => {
                user_1.default.create({ email: req.body.email, password: hash, role: "basic", active: true })
                    .then(() => {
                    res.send("User Registered");
                }).catch((err) => {
                    if (err) {
                        res.sendStatus(400).json({ error: err });
                    }
                });
            });
        }
    });
};
exports.signup = signup;
const login = async (req, res) => {
    const user = await user_1.default.findOne({ email: req.body.email });
    if (user && user.active == true) {
        const pass = req.body.password;
        bcrypt.compare(pass, user.password).then((match) => {
            if (!match) {
                res.sendStatus(400).json({ error: "wrong password" });
            }
            else {
                const accessToken = generateToken(user);
                res.json({ accessToken: accessToken, id: user._id });
            }
        });
    }
    else {
        res.send("Mail not registered");
    }
};
exports.login = login;
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, "my_secret_key");
}
function ensureToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401).json({ error: "Not Authenticated" });
    }
    jsonwebtoken_1.default.verify(token, "my_secret_key", (err, data) => {
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
const view = (req, res) => {
    if (req.user.role == "admin") {
        userInfo_1.default.find().then((p) => {
            console.log(p);
        }).catch(error => {
            console.log(error);
        });
    }
};
exports.view = view;
const add = (req, res) => {
    if (req.user.role == "basic" && req.user.active == true && req.user._id == req.params.id) {
        userInfo_1.default.create(req.body).then(() => {
            res.send("User Info created");
        });
    }
    else {
        res.send("Cannot add info");
    }
};
exports.add = add;
const update = (req, res) => {
    if (req.user.role == "basic" && req.user.active == true && req.user._id == req.params.id) {
        //userInfoModel.name=req.body.name;
        let user_data = new userInfo_1.default({ _id: req.params.id, name: req.body.name, address: req.body.address });
        user_data.save().then(() => {
            res.json({ user_data });
        }).catch(error => {
            res.json(error);
        });
    }
    else {
        res.send("Cannot update info");
    }
};
exports.update = update;
const deactivate = (req, res) => {
    if (req.user.role == "admin") {
        user_1.default.findOne({ _id: req.params.id }, function (err, user) {
            user.active = false;
        });
    }
};
exports.deactivate = deactivate;
