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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HandleResponse_1 = __importDefault(require("../helpers/HandleResponse"));
const key = process.env.SECRET_KEY || "secret";
class FavoritesController {
    static CreateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var UserInput = req.body;
            yield Users_1.default.findOne({ email: UserInput.email }).then((user) => {
                if (user) {
                    return res.status(400).json({
                        message: "User already exists",
                    });
                }
                else {
                    bcryptjs_1.default.hash(UserInput.password, 10, (err, hash) => {
                        var newUser = new Users_1.default(Object.assign(Object.assign({}, UserInput), { password: hash, modified: new Date(), created: new Date() }));
                        newUser.save().then((user) => {
                            var { full_name, email } = UserInput;
                            let token = jsonwebtoken_1.default.sign({ full_name, email }, key);
                            (0, HandleResponse_1.default)({
                                res,
                                status: 201,
                                message: "User Created",
                                data: {
                                    user,
                                    token
                                }
                            });
                        });
                    });
                }
            });
        });
    }
    static SignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var LoginInput = req.body;
            yield Users_1.default.findOne({ email: LoginInput.email })
                .then((user) => {
                if ((user)) {
                    if (bcryptjs_1.default.compareSync(LoginInput.password, user.password)) {
                        var { full_name, email } = user;
                        let token = jsonwebtoken_1.default.sign({ full_name, email }, key);
                        (0, HandleResponse_1.default)({
                            res,
                            status: 201,
                            message: "Login Successful",
                            data: {
                                token
                            }
                        });
                    }
                    else {
                        (0, HandleResponse_1.default)({
                            res,
                            status: 401,
                            message: "Passwords do not match",
                            data: {
                                user
                            }
                        });
                    }
                }
                else {
                    (0, HandleResponse_1.default)({
                        res,
                        status: 401,
                        message: "No User with that email address",
                        data: LoginInput
                    });
                }
            });
        });
    }
}
exports.default = FavoritesController;
