import {LambdaRequest, Response, Router} from "../middleware/Router";
import {BodyParserMiddleware} from "../middleware/BodyParserMiddleware";
import {ClassController, Method} from "../Annotations";


@ClassController({router: new Router([new BodyParserMiddleware()]), exports, json: true})
class AnnotationClassControllerExample {

	constructor(req: LambdaRequest<any>, response: Response) {
		// Here we can initialize our class with the request if needed
	}

	@Method()
	public async echo() {
		await new Promise((resolve) => {
			const https = require('https')
			const options = {
				hostname: 'www.google.com',
				port: 443,
				path: '/',
				method: 'GET'
			}

			const req = https.request(options, (res: any) => {
				console.log(`statusCode: ${res.statusCode}`)

				res.on('data', (d: Buffer) => {
					process.stdout.write(d)
				})
				res.on("end", () => {
					resolve();
				});
			})

			req.on('error', (error: Error) => {
				console.error(error)
			})
			req.end();
		})
		return {status: "OK"}
	}
}
