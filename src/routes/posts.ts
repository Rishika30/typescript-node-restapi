import express from "express";
const router = express.Router();
import {signup, login, token, view, getPost, add, update, deactivate, ensureToken} from "../controller/posts";
import {createPostValidator} from "../validator/index";
import {verifyEmail} from "../emailVerification/verify";

router.post("/signup", signup);
router.get('/login', login);
router.post('/token', token);
router.get('/user/:id/data',ensureToken,view);
router.get('/user/getPost', ensureToken, getPost);
router.post('/user/data', ensureToken,createPostValidator,add);
router.put('/user/:id/data',ensureToken,createPostValidator,update);
router.get('/user/:id/data', ensureToken,deactivate);
router.get('/verify/:userId/:uniqueString', verifyEmail);

export= router;