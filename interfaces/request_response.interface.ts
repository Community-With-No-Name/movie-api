import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface RequestResponse{
    res: Response<any, Record<string, any>, number>;
    req: Request<{}, any, any, ParsedQs>;
}