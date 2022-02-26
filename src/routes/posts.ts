import express from "express";
const router = express.Router();
import {signup, login, view, add, update, deactivate, ensureToken} from "../controller/posts";
import {createPostValidator} from "../validator/index";

router.post("/signup", signup);
router.get('/login', login);
router.get('/user/:id/data',ensureToken,view);
router.post('/user/data', ensureToken,createPostValidator,add);
router.put('/user/:id/data',ensureToken,createPostValidator,update);
router.get('/user/:id/data', ensureToken,deactivate);
export= router;