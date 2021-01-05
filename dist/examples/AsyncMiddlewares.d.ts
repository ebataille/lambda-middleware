import { AbstractMiddleware, LambdaRequest, Response } from "../middleware/Router";
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class AsyncMiddlewares extends AbstractMiddleware<any> {
    private count;
    private timeout;
    constructor(count: number, timeout: number);
    protected after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<any>;
    protected error(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, err: Error): Promise<any>;
}
