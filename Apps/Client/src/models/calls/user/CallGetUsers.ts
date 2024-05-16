import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = {
    users: { value: string, confirmed: boolean }[],
    admins: { value: string, confirmed: boolean }[],
};

export interface ErrorResponseData {

}

export default class CallGetUsers extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 