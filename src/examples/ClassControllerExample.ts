import {Router, LambdaRequest, Response, AbstractMiddleware} from "../middleware/Router";
import {BodyParserMiddleware} from "../middleware/BodyParserMiddleware";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayEventRequestContextWithAuthorizer} from "aws-lambda";


class ClassControllerExample {

	constructor(req: LambdaRequest<any>, response: Response) {
		// Here we can initialize our class with the request if needed
	}

	public async echo(req: LambdaRequest<any>, response: Response) {
		console.log(req.json);
		response.json({...req.json});
	}

	public async preAndPostMiddleware(req: LambdaRequest<any>, response: Response) {
		console.log(req.json);
		response.json({...req.json});
	}
}

class PreMiddleware extends AbstractMiddleware<any> {
	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("after called after other middlewares");
	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("before called before other middlewares");
	}
}

class PostMiddleware extends AbstractMiddleware<any> {
	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("after called before other middlewares");
	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>, response: Response): Promise<void> {
		console.log("before called after other middlewares");
	}
}

const router = new Router([new BodyParserMiddleware()]);
router.addClass(exports, "echo", ClassControllerExample);
router.addClass(exports, "preAndPostMiddleware", ClassControllerExample, [new PreMiddleware()], [new PostMiddleware()]);

