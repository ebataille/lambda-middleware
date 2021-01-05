import {AbstractMiddleware, LambdaRequest, Response, Router} from "../middleware/Router";
import {BodyParserMiddleware} from "../middleware/BodyParserMiddleware";
import {body, ClassController, Method} from "../Annotations";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayEventRequestContextWithAuthorizer} from "aws-lambda";

class PreMiddleware extends AbstractMiddleware<any> {
	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("annotation after called after other middlewares");
	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("annotation before called before other middlewares");
	}
}

class PostMiddleware extends AbstractMiddleware<any> {
	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("annotation after called before other middlewares");
	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("annotation before called after other middlewares");
	}
}

@ClassController({router: new Router([new BodyParserMiddleware()]), exports, json: true})
class AnnotationClassControllerExample {

	constructor(req: LambdaRequest<any>, response: Response) {
		// Here we can initialize our class with the request if needed
	}

	@Method()
	public async echo() {
		await new Promise((resolve) => {
			const https = require('https');
			const options = {
				hostname: 'www.google.com',
				port: 443,
				path: '/',
				method: 'GET'
			};

			const req = https.request(options, (res: any) => {
				console.log(`statusCode: ${res.statusCode}`);

				res.on('data', (d: Buffer) => {
					process.stdout.write(d)
				});
				res.on("end", () => {
					resolve();
				});
			});

			req.on('error', (error: Error) => {
				console.error(error)
			});
			req.end();
		});
		return {status: "OK"}
	}

	@Method({}, [new PreMiddleware()], [new PostMiddleware()])
	public async preAndPostMiddleware(@body body: any) {
		return body;
	}
}

