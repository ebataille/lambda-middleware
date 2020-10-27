import { AbstractMiddleware, LambdaRequest, Response } from "./Router";
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class GzipMiddleware extends AbstractMiddleware<any> {
    protected after(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected before(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
}
