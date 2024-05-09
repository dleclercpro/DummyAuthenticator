import { API_ROOT } from '../../../config/Config';
import { ServerResponse } from '../../../types/CallTypes';

/**
 * This is a class that models API calls.
 */
class Call<RequestData = void, ResponseData = void, ErrorResponseData = void> {
    private name: string;
    private url: string;
    private method: string;
    private payload: RequestData | undefined;
    private headers: HeadersInit;
    private params: RequestInit;

    constructor(url: string, method: string) {
        this.name = this.constructor.name;
        this.url = `${API_ROOT}${url}`;
        this.method = method;
        this.headers = {}
        this.params = {};
    }

    getUrl(): string {
        return this.url;
    }

    getMethod(): string {
        return this.method;
    }

    getPayload(): RequestData | undefined {
        return this.payload;
    }

    getHeaders() {
        return this.headers;
    }

    setUrl(url: string) {
        this.url = url;
    }

    setMethod(method: string) {
        this.method = method;
    }

    setPayload(payload: RequestData) {
        this.payload = payload;
    }

    setHeaders(headers: HeadersInit) {
        this.headers = headers;
    }

    prepareHeaders() {
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    prepare() {
        this.prepareHeaders();

        this.params = {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.payload),
            credentials: 'include',
        };
    }

    async execute(payload?: RequestData) {
        let error = '';

        console.log(`Executing API call '${this.name}': ${this.url}`);

        // Store call's payload
        this.payload = payload;

        // Set API call parameters
        this.prepare();

        // Execute call
        const response = await fetch(this.url, this.params)
            .catch((err) => {
                error = `NO_SERVER_CONNECTION`;
            });

        // Handle server response
        if (response) {
            const data: ServerResponse<ResponseData | ErrorResponseData> = await response
                .json()
                .catch((err) => {
                    error = `INVALID_JSON`;
                });

            // There was valid JSON data in the response
            if (data) {
                const { code, error } = data;

                // There was an error
                if (response.status >= 400 && error) {
                    return Promise.reject(data);
                }

                // Everything went fine
                if (response.status < 400 && Number.isInteger(code) && code >= 0) {
                    return Promise.resolve(data);
                }
            }
        }

        // There were other issues
        console.error(`Error in call '${this.name}': ${error} [${response ? response.status : '?'}]`);

        // Something went wrong, but we let the processing happen further down the line
        throw new Error(error);
    }
}

export default Call;