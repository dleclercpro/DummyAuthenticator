import { Call } from './Call';
import { HttpMethod } from '../types/HTTPTypes';

abstract class CallPUT<Data, ResponseData, ErrorResponseData = void> extends Call<Data, ResponseData, ErrorResponseData> {

    constructor(url: string = '') {
        super(url, HttpMethod.PUT);
    }

    sanitize(data: Data): Data {
        return data;
    }

    execute(data?: Data) {
        return super.execute(data ? this.sanitize(data) : undefined);
    }
}

export default CallPUT;