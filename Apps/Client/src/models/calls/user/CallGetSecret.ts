import CallGET from '../base/CallGET';

export type ResponseData = string;

export default class CallGetSecret extends CallGET<void, ResponseData> {

    constructor() {
        super(`/secret`);
    }
}