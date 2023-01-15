import { HandleResponse } from "../interfaces/handleResponse";

export default function HandleResponse({res, status, data, message}: HandleResponse){
    return res.status(status).json({
        message,
        ...data
    })
}