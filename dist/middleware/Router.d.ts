import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class Router {
    private middlewares;
    static routes: any;
    constructor(middlewares?: AbstractMiddleware<any>[]);
    private chainMiddlewares;
    private preHandle;
    private catchError;
    handler: (finalHandler: AWSCallback, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]) => (event: LambdaRequest<any>, context: APIGatewayEventRequestContext) => Promise<{
        statusCode: number;
        body: any;
        isBase64Encoded: boolean;
        headers: any;
    } | undefined>;
    classHandler: (classHandler: any, name: string, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]) => (event: LambdaRequest<any>, context: APIGatewayEventRequestContext) => Promise<{
        statusCode: number;
        body: any;
        isBase64Encoded: boolean;
        headers: any;
    } | undefined>;
    add(exports: any, name: string, handler: AWSCallback, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]): void;
    addClass(name: string, handler: any, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]): (event: LambdaRequest<any>, context: APIGatewayEventRequestContext) => Promise<{
        statusCode: number;
        body: any;
        isBase64Encoded: boolean;
        headers: any;
    } | undefined>;
    static handle(req: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): any;
}
declare type AWSCallback = (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>;
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
export {};
