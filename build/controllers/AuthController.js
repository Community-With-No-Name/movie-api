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
const MailJetInitializer_1 = __importDefault(require("../helpers/MailJetInitializer"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const OTP_1 = __importDefault(require("../models/OTP"));
const key = process.env.SECRET_KEY || "secret";
class AuthController {
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
                        newUser.save().then((user) => __awaiter(this, void 0, void 0, function* () {
                            var { full_name, email } = UserInput;
                            let token = jsonwebtoken_1.default.sign({ full_name, email, id: user._id }, key);
                            (0, HandleResponse_1.default)({
                                res,
                                status: 201,
                                message: "User Created",
                                data: {
                                    user,
                                    token
                                }
                            });
                        }));
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
                        let token = jsonwebtoken_1.default.sign({ full_name, email, id: user._id }, key);
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
    static RetrieveAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            yield Users_1.default.findOne({ email })
                .then((user) => {
                if (user) {
                    const generatedOtp = new OTP_1.default({ otp: otp_generator_1.default.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }) });
                    generatedOtp.save().then(() => {
                        (0, MailJetInitializer_1.default)({
                            variables: {
                                "username": user.full_name,
                                "otp": generatedOtp.otp
                            },
                            receiver: user, template_id: 4388122, subject: "Movibes"
                        });
                        let token = jsonwebtoken_1.default.sign({ email, id: user._id }, key);
                        (0, HandleResponse_1.default)({
                            res,
                            status: 200,
                            data: { token },
                            message: `Account tied to ${email} found successfully`
                        });
                    });
                }
                else {
                    (0, HandleResponse_1.default)({
                        res,
                        status: 401,
                        data: email,
                        message: "User doesn't exist"
                    });
                }
            });
        });
    }
    static VerifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { otp } = req.body;
            yield OTP_1.default.findOne({ otp }).then((dt) => {
                if (dt) {
                    (0, HandleResponse_1.default)({
                        res,
                        status: 200,
                        data: {
                            otp,
                            verified: true
                        },
                        message: "OTP verified successfully"
                    });
                }
                else {
                    (0, HandleResponse_1.default)({
                        res,
                        status: 500,
                        data: {
                            otp
                        },
                        message: "Wrong OTP"
                    });
                }
            });
        });
    }
}
exports.default = AuthController;
