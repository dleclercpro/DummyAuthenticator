import CallPUT from '../base/CallPUT';

export interface Data {
    token: string,
}

export interface ResponseData {
    string: string,
    content: object,
}

export default class CallValidateToken extends CallPUT<Data, ResponseData> {

    constructor() {
        super(`/token`);
    }
}