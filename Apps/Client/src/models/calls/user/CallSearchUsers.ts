import { UserType } from '../../../constants';
import CallPUT from '../base/CallPUT';

export interface Data {
    searchText: string,
}

export type ResponseData = { type: UserType, email: string, confirmed: boolean }[];

export interface ErrorResponseData {

}

export default class CallSearchUsers extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 