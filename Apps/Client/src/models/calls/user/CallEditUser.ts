import { UserType } from '../../../constants';
import CallPOST from '../base/CallPOST';

export interface Data {
    email: string,
    type?: UserType,
    ban?: boolean,
}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallEditUser extends CallPOST<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/user`);
    }
}