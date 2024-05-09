import CallPOST from '../base/CallPOST';

export type Data = {
    renew: boolean,
};

export type ResponseData = string;

export default class CallGetSecret extends CallPOST<Data, ResponseData> {

    constructor() {
        super(`/secret`);
    }
}