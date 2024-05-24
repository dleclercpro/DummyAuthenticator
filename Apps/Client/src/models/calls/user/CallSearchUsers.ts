import { UserJSON } from '../../../types/JSONTypes';
import CallPUT from '../base/CallPUT';

export interface Data {
    searchText: string,
}

export type ResponseData = UserJSON[];

export interface ErrorResponseData {

}

export default class CallSearchUsers extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 