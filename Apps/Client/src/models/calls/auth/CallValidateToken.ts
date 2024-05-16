import CallPUT from '../base/CallPUT';

export interface Data {
    token: string,
}

export interface ResponseData {
    string: string,
    content: object,
}

export type ErrorResponseData = {

};

export default class CallValidateToken extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/token`);
    }
}