import CallPOST from '../base/CallPOST';

export type Data = {
    renew: boolean,
};

export type ResponseData = string;

export type ErrorResponseData = {

};

export default class CallGetSecret extends CallPOST<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/secret`);
    }
}