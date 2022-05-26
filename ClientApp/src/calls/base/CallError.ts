class CallError<Data> extends Error {
    code: number;
    data?: Data;
    
    constructor(msg: string, data?: Data, code: number = -1) {
        super(msg);

        // Set error code
        this.code = code;

        // Set error data
        this.data = data;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CallError.prototype);
    }

    getCode = () => {
        return this.code;
    }
}

export default CallError;