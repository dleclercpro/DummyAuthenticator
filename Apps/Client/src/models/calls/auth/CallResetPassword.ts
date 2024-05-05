import CallPOST from '../base/CallPOST';

export interface Data {
    password: string,
}

export default class CallResetPassword extends CallPOST<Data, void> {

    constructor(token?: string) {
        const url = `/reset-password`;
        super(token ? `${url}?token=${token}` : url);
    }
}