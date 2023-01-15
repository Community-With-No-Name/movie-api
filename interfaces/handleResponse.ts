// import HandleResponse from '../helpers/HandleResponse';
import { RequestResponse } from './request_response.interface';

export interface HandleResponse{
    res: RequestResponse['res'];
    message: string;
    status:number;
    data: any;
}