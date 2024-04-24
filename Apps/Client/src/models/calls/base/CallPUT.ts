import { CallType } from '../../../types/CallTypes';
import Call from './Call';

class CallPUT<RequestData = void, ResponseData = void, ErrorResponseData = void> extends Call<RequestData, ResponseData, ErrorResponseData> {

    constructor(url: string) {
        super(url, CallType.PUT);
    }
}

export default CallPUT;