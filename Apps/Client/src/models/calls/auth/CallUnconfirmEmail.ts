import CallPUT from '../base/CallPUT';

export interface Data {
    email: string,
}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallUnconfirmEmail extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/unconfirm-email`);
    }
}