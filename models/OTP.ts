import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
    otp: Number,
    modified: Date,
    created:{
        type: Date,
        expires: "2m",
        default: Date.now
    },
})
const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;
