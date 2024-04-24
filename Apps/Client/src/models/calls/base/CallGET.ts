import { CallType } from '../../../types/CallTypes';
import Call from './Call';

class CallGET<RequestData = void, ResponseData = void, ErrorResponseData = void> extends Call<RequestData, ResponseData, ErrorResponseData> {

    constructor(url: string) {
        super(url, CallType.GET);
    }
}

export default CallGET;