import express from "express"
var router = express.Router()
import cors from "cors"
import AuthController from "../controllers/AuthController"
import { RequestResponse } from "../interfaces/request_response.interface"

router.use(cors())

router.get("/", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.CreateUser(req, res))
router.post("/", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.SignIn(req, res))
router.patch("/", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.CreateUser(req, res))
router.delete("/", (req: RequestResponse["req"], res: RequestResponse["res"])=>AuthController.SignIn(req, res))


module.exports = router

