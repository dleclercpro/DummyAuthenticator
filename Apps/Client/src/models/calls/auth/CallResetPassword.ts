import CallPOST from '../base/CallPOST';

export interface Data {
    password: string,
}

export type ResponseData = {

};

export type ErrorResponseData = {

};

export default class CallResetPassword extends CallPOST<Data, ResponseData, ErrorResponseData> {

    constructor(token?: string) {
        const url = `/reset-password`;
        super(token ? `${url}?token=${token}` : url);
    }
}