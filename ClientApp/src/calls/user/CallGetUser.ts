import CallGET from '../CallGET';

interface Response {
    email: string,
}

export class CallGetUser extends CallGET<Response> {

    constructor() {
        super(`user`);
    }
}