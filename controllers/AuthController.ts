import { RequestResponse } from "../interfaces/request_response.interface";
import { CreateUserType, LoginType } from "../interfaces/user.interface";
import Users from "../models/Users";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import HandleResponse from '../helpers/HandleResponse';
import MailJetInit from "../helpers/MailJetInitializer";
import otpGenerator  from "otp-generator"
import OTP from "../models/OTP";
const key = process.env.SECRET_KEY || "secret";

class AuthController {
  static async CreateUser(
    req: RequestResponse["req"],
    res: RequestResponse["res"]
  ) {
    var UserInput: CreateUserType = req.body;
    await Users.findOne({ email: UserInput.email }).then((user) => {
      if (user) {
        return res.status(400).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(UserInput.password, 10, (err,hash)=>{
            var newUser = new Users({
            ...UserInput,
            password: hash,
            modified: new Date(),
            created: new Date(),
          });
          newUser.save().then(async (user) => {
              var {full_name, email} = UserInput
              let token = jwt.sign({full_name, email, id: user._id}, key)
              HandleResponse({
                  res,
                  status: 201,
                  message: "User Created",
                  data: {
                      user,
                      token
                  }
              })
          });
        })
      }
    });
  }
  static async SignIn(req: RequestResponse['req'], res: RequestResponse['res']) {
    var LoginInput: LoginType = req.body;
    await Users.findOne({email: LoginInput.email})
    .then((user)=>{
        if((user)){
            if(bcrypt.compareSync(LoginInput.password, user.password)){
              var {full_name, email} = user
              let token = jwt.sign({full_name, email, id:user._id}, key)
              HandleResponse({
                res,
                status: 201,
                message: "Login Successful",
                data: {
                  token
                }
              })
            }
            else {
              HandleResponse({
                res,
                status: 401,
                message: "Passwords do not match",
                data: {
                  user
                }
              })
            }
        } else {
            HandleResponse({
                res,
                status: 401,
                message: "No User with that email address",
                data: LoginInput
            })
        }
    })

  }
  static async RetrieveAccount(req: RequestResponse['req'], res: RequestResponse['res']) {
    const {email} = req.body
    await Users.findOne({email})
    .then((user)=>{
      if(user){
        const generatedOtp = new OTP({otp: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })})
        generatedOtp.save().then(()=>{
        MailJetInit({
          variables: {
            "username": user.full_name,
            "otp": generatedOtp.otp
          },
          receiver: user, template_id: 4388122, subject: "Movibes"
        })
        let token = jwt.sign({email, id: user._id}, key)
          HandleResponse({
            res,
            status: 200,
            data: {token},
            message: `Account tied to ${email} found successfully`
          })
        })
      } else {
        HandleResponse({
          res,
          status: 401,
          data: email,
          message: "User doesn't exist"
        })
      }
    })
  }
  static async VerifyOTP(req: RequestResponse['req'], res: RequestResponse['res']){
    var { otp } = req.body
    await OTP.findOne({otp}).then((dt)=>{
      if(dt){
        HandleResponse({
          res,
          status: 200,
          data: {
            otp,
            verified: true
          },
          message: "OTP verified successfully"
        })
      }
      else {
        HandleResponse({
          res,
          status: 500,
          data: {
            otp
          },
          message: "Wrong OTP"
        })
      }
    })
  }
  // static async ChangePassword(req: RequestResponse['req'], res: RequestResponse['res']){
  //   const {}
  // }
}
export default AuthController;