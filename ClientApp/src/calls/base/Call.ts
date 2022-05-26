import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { HttpMethod, HttpStatusCode } from '../../types/HTTPTypes';
import { MIMEApplicationType } from '../../types/MIMETypes';
import { ServerError } from '../../errors/ServerErrors';
import CallError from './CallError';

const UNKNOWN_ERROR = new CallError(ServerError.Unknown);



interface Response<ResponseData> {
    code: number,
    data: ResponseData,
}

interface ErrorResponse<ErrorResponseData> {
    code: number,
    error: string,
    data?: ErrorResponseData,
}



export abstract class Call<Data, ResponseData, ErrorResponseData> {
    private url: string;
    private method: HttpMethod;
    private headers: AxiosRequestHeaders;
    private data?: Data;

    public constructor(url: string, method: HttpMethod) {
        this.url = `/${url}`;
        this.method = method;
        this.headers = {
            'Content-Type': MIMEApplicationType.JSON,
            'Accept': MIMEApplicationType.JSON,
        };
    }

    public getUrl() {
        return this.url;
    }

    public getMethod() {
        return this.method;
    }

    public getData() {
        return this.data;
    }

    public execute(data?: Data) {
        console.log(`Executing call: [${this.method}] ${this.url}`);

        // Store data for eventual further processing
        if (data) {
            this.data = data;
        }

        const request: AxiosRequestConfig = {
            method: this.method,
            url: this.url,
            headers: this.headers,
            data: this.data ? this.data : undefined,
        };

        return axios(request)
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    protected handleSuccess(response: AxiosResponse<Response<ResponseData>>): ResponseData {
        const { code, data } = response.data;

        if (code >= 0) {
            return data;
        }

        throw UNKNOWN_ERROR;
    }

    protected handleError(err: AxiosError<ErrorResponse<ErrorResponseData>>): never {
        const { response } = err;

        // Verify if error can be processed at all
        if (!response) {
            throw UNKNOWN_ERROR;
        }

        // Verify if call was authorized
        const { status } = response;

        if (status === HttpStatusCode.UNAUTHORIZED){
            throw new CallError(ServerError.Unauthorized);
        }

        // Verify if error was correctly sent by server
        if (!response.data.code) {
            throw UNKNOWN_ERROR;
        }

        // Throw server error
        const { code, error, data } = response.data;
        
        throw new CallError(error, data, code);
    }
}