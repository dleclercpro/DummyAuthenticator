import CallDELETE from '../base/CallDELETE';

export interface Data {
    email: string,
}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallDeleteUser extends CallDELETE<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/user`);
    }
}