import {LambdaRequest, Response, Router} from "../middleware/Router";
import {body, ClassController, Method} from "../Annotations";
import {AsyncMiddlewares} from "./AsyncMiddlewares";


@ClassController({json: true, exports, router: new Router([new AsyncMiddlewares(1, 5000), new AsyncMiddlewares(2, 200), new AsyncMiddlewares(3, 150)])})
class TestErrorController {

	constructor(req: LambdaRequest<any>, response: Response) {
		// Here we can initialize our class with the request if needed
	}

	@Method()
	public async echo(@body body: any) {
		console.log ("ECHO");
		return {echo: body}
	}

	@Method()
	public async error(@body body: any) {
		console.log ("ERROR")
		throw {status: 500, message: body}
	}
}
