import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class Router {
    private middlewares;
    constructor(middlewares?: AbstractMiddleware<any>[]);
    private chainMiddlewares;
    handler: (finalHandler: (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>) => (event: LambdaRequest<any>, context: APIGatewayEventRequestContext, callback: Function) => Promise<void>;
    add(exports: any, name: string, handler: (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>): void;
}
export declare class Response {
    private req;
    private _statusCode;
    private _body;
    private _headers;
    private _encodeToBase64;
    constructor(req: APIGatewayProxyEvent);
    setHeader(name: string, value: string): void;
    setStatusCode(value: number): void;
    setBody(body: any, encodeToBase64?: boolean): void;
    getBody(): any;
    json(body: any): void;
    getBodyByStatus(): "OK" | "Error" | null;
    getResponse(): {
        statusCode: number;
        body: any;
        isBase64Encoded: boolean;
        headers: any;
    };
    clearCookie(name: string, options: any): this;
    send(res: any): void;
    redirect(url: string, statusCode?: number): void;
    cookie(name: string, value: string, options: any): this;
}
export declare abstract class AbstractMiddleware<T> {
    execute(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, next: Function): Promise<any>;
    protected abstract before(event: LambdaRequest<T>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected abstract after(event: LambdaRequest<T>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected error(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, err: Error): void;
}
export interface LambdaRequest<T> extends APIGatewayProxyEvent {
    json: T;
    secret: string;
}
