import {AbstractMiddleware, LambdaRequest, Response} from "../middleware/Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";

export class AsyncMiddlewares extends AbstractMiddleware<any> {

	constructor(private count: number, private timeout: number) {
		super();
	}

	protected async after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {
		console.log(this.count, "after is called")
	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response): Promise<any> {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log(this.count, "middleware is  called");
				resolve();
			}, this.timeout);
		});
	}

	protected error(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, err: Error) {
		console.log(this.count, "error is called")
	}
}