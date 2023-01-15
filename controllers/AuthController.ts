import { RequestResponse } from "../interfaces/request_response.interface";
import { CreateUserType, LoginType } from "../interfaces/user.interface";
import Users from "../models/Users";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import HandleResponse from '../helpers/HandleResponse';
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
          newUser.save().then((user) => {
              var {full_name, email} = UserInput
              let token = jwt.sign({full_name, email}, key)
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
              let token = jwt.sign({full_name, email}, key)
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
}
export default AuthController;
