import { AbstractMiddleware, LambdaRequest, Response } from "./Router";
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
export declare class BodyParserMiddleware extends AbstractMiddleware<any> {
    protected after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
    protected before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;
}
