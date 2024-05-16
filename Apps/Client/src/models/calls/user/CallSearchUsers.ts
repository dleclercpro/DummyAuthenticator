import CallPUT from '../base/CallPUT';

export interface Data {
    searchText: string,
}

export type ResponseData = {
    users: { value: string, confirmed: boolean }[],
    admins: { value: string, confirmed: boolean }[],
};

export interface ErrorResponseData {

}

export default class CallSearchUsers extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 