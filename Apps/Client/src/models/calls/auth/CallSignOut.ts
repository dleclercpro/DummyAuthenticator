import CallGET from '../base/CallGET';

export type Data = {

};

export type ResponseData = {

};

export type ErrorResponseData = {

};

export default class CallSignOut extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/sign-out`);
    }
}