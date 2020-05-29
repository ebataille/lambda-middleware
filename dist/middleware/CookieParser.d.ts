import { AbstractMiddleware, Response } from "./Router";
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class CookieParser extends AbstractMiddleware<any> {
    private parser;
    constructor(secret: string);
    protected after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected before(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
}
