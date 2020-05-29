import {AbstractMiddleware, LambdaRequest, Response} from "./Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";

export class BodyParserMiddleware extends AbstractMiddleware<any> {

	protected async after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {

	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response) {
		let contentType = event.headers ? event.headers["Content-Type"] || event.headers["content-type"] : null;
		if (contentType && contentType.indexOf("application/json") !== -1 && event.body) {
			(event as LambdaRequest<any>).json = JSON.parse(event.body);
		}
	}
}