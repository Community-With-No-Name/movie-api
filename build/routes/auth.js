"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
router.use((0, cors_1.default)());
router.post("/sign_up", (req, res) => AuthController_1.default.CreateUser(req, res));
router.post("/sign_in", (req, res) => AuthController_1.default.SignIn(req, res));
router.post("/recover_account", (req, res) => AuthController_1.default.RetrieveAccount(req, res));
module.exports = router;
