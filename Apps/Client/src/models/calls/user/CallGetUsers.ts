import { UserJSON } from '../../../types/JSONTypes';
import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = UserJSON[];

export interface ErrorResponseData {

}

export default class CallGetUsers extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/users`);
    }
} 