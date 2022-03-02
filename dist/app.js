"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const posts_1 = __importDefault(require("./routes/posts"));
const express_validator_1 = __importDefault(require("express-validator"));
mongoose_1.default.connect(`${process.env.MONGO_URI}`)
    .then(() => console.log('DB Connected'));
mongoose_1.default.connection.on('error', err => {
    console.log(`DB Connection error: ${err.message}`);
});
app.use((0, express_validator_1.default)());
app.use("/", posts_1.default);
const port = 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
