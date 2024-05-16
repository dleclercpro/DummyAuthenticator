import CallPOST from '../base/CallPOST';

export interface Data {
    email: string,
    password: string,
}

export type ResponseData = {

};

export type ErrorResponseData = {

};

export default class CallSignUp extends CallPOST<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/sign-up`);
    }
}