import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = {
    users: string[],
    admins: string[],
};

export interface ErrorResponseData {

}

export default class CallGetUsers extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 