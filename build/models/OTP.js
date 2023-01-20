"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OTPSchema = new mongoose_1.default.Schema({
    otp: Number,
    modified: Date,
    created: {
        type: Date,
        expires: "2m",
        default: Date.now
    },
});
const OTP = mongoose_1.default.model('OTP', OTPSchema);
exports.default = OTP;
