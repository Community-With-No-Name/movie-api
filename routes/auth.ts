import express from "express"
var router = express.Router()
import cors from "cors"
import AuthController from "../controllers/AuthController"
import { RequestResponse } from "../interfaces/request_response.interface"

router.use(cors())

router.post("/sign_up", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.CreateUser(req, res))
router.post("/sign_in", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.SignIn(req, res))
router.post("/recover_account", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.RetrieveAccount(req, res))


module.exports = router
