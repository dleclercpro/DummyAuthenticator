import { Call } from './Call';
import { HttpMethod } from '../types/HTTPTypes';

abstract class CallHEAD<ResponseData, ErrorResponseData = void> extends Call<void, ResponseData, ErrorResponseData> {

    constructor(url: string = '') {
        super(url, HttpMethod.HEAD);
    }
}

export default CallHEAD;