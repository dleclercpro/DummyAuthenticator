import { Call } from './Call';
import { HttpMethod } from '../../types/HTTPTypes';

abstract class CallDELETE<Data, ResponseData, ErrorResponseData = void> extends Call<Data, ResponseData, ErrorResponseData> {

    constructor(url: string) {
        super(url, HttpMethod.DELETE);
    }
}

export default CallDELETE;