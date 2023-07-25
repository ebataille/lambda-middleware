import { AbstractMiddleware, LambdaRequest, Response } from "./Router";
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class ErrorLogger extends AbstractMiddleware<any> {
    protected after(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected error(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, err: Error): void;
}
