import { HttpMethod } from '../types/HTTPTypes';
import { Call } from './Call';

abstract class CallGET<ResponseData, ErrorResponseData = void> extends Call<void, ResponseData, ErrorResponseData> {

    constructor(url: string) {
        super(url, HttpMethod.GET);
    }
}

export default CallGET;