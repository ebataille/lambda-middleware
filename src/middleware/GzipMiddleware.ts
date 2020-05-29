import {AbstractMiddleware, LambdaRequest, Response} from "./Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import * as zlib from "zlib";
import * as stream from "stream";

export class GzipMiddleware extends AbstractMiddleware<any> {


	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response) {
		let acceptEncoding = event.headers['accept-encoding'];
		if (!acceptEncoding) {
			acceptEncoding = '';
		}
		let stream: stream.Transform | null = null;
		if (/\bdeflate\b/.test(acceptEncoding)) {
			response.setHeader("Content-Encoding", "deflate");
			stream = zlib.createDeflate();
		} else if (/\bgzip\b/.test(acceptEncoding)) {
			response.setHeader("Content-Encoding", "gzip");
			stream = zlib.createGzip();
		} else if (/\bbr\b/.test(acceptEncoding)) {
			response.setHeader("Content-Encoding", "br");
			stream = zlib.createBrotliCompress();
		}

		let buffers: Uint8Array[] = [];
		await new Promise((resolve, reject) => {
			if (stream) {
				stream.on("end", () => {
					resolve();
				});
				stream.on("data", (chunk) => {
					buffers.push(chunk);
					resolve();
				});
				stream.on("error", (err) => {
					reject(err);
				});
				stream.write(response.getBody());
			} else {
				reject(new Error("no streams attached"));
			}
		});
		let buffer = Buffer.concat(buffers);
		response.setBody(buffer, true);
	}

	protected async before(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {
		response.setHeader("Vary", "Accept-Encoding");
	}

}