import {AbstractMiddleware, Response} from "./Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import * as cookieParser from "cookie-parser";

export class CookieParser extends AbstractMiddleware<any> {
	private parser: Function;

	constructor(secret: string) {
		super();
		this.parser = cookieParser(secret);
	}

	protected async after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {

	}

	protected async before(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {
		if (event.headers) {
			this.parser(event, {}, () => {
			});
		}
	}
}