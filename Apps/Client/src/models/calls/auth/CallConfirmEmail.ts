import CallPUT from '../base/CallPUT';

export type Data = {

};

export type ResponseData = {

};

export type ErrorResponseData = {

};

export default class CallConfirmEmail extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor(token: string) {
        super(`/confirm-email?token=${token}`);
    }
}