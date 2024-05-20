import { UserType } from '../../../constants';
import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = { type: UserType, email: string, confirmed: boolean }[];

export interface ErrorResponseData {

}

export default class CallGetUsers extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 