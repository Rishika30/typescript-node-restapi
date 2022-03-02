"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_1 = require("../controller/posts");
const index_1 = require("../validator/index");
router.post("/signup", posts_1.signup);
router.get('/login', posts_1.login);
router.get('/user/:id/data', posts_1.ensureToken, posts_1.view);
router.post('/user/data', posts_1.ensureToken, index_1.createPostValidator, posts_1.add);
router.put('/user/:id/data', posts_1.ensureToken, index_1.createPostValidator, posts_1.update);
router.get('/user/:id/data', posts_1.ensureToken, posts_1.deactivate);
module.exports = router;
