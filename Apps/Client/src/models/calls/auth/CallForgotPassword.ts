import CallPOST from '../base/CallPOST';

export interface Data {
    email: string,
}

export type ResponseData = {

};

export type ErrorResponseData = {

};

export default class CallForgotPassword extends CallPOST<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/forgot-password`);
    }
}