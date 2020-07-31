import {Router, LambdaRequest, Response} from "../middleware/Router";
import {BodyParserMiddleware} from "../middleware/BodyParserMiddleware";


class ClassControllerExample {

	constructor (req : LambdaRequest<any>, response : Response) {
		// Here we can initialize our class with the request if needed
	}

	public async echo(req: LambdaRequest<any>, response: Response) {
		console.log(req.json);
		response.json({...req.json});
	}
}

const router = new Router([new BodyParserMiddleware()]);
router.addClass(exports, "echo", ClassControllerExample);

