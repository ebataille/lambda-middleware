/*
Copyright 2020 Edouard Bataille

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import * as cookie from "cookie";
import {sign} from "cookie-signature";

export class Router {

	constructor(private middlewares: AbstractMiddleware<any>[] = []) {
	}

	private chainMiddlewares([firstMiddleware, ...rest]: AbstractMiddleware<any>[], response: Response, finalHandler: (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>) {
		if (firstMiddleware) {
			return (event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): Promise<any> => {
				try {
					return firstMiddleware.execute(event, context, response, this.chainMiddlewares(rest, response, finalHandler))
				} catch (error) {
					return Promise.reject(error)
				}
			}
		}
		return (event: LambdaRequest<any>, context: APIGatewayEventRequestContext) => {
			if (event.httpMethod === "OPTIONS") {
				return;
			}
			return finalHandler(event, response, context);
		}
	}

	private preHandle(event: LambdaRequest<any>, context: APIGatewayEventRequestContext) {
		const response = new Response(event);
		(<any>context).callbackWaitsForEmptyEventLoop = false;
		event.queryStringParameters = event.queryStringParameters || {};
		event.pathParameters = event.pathParameters || {};
		event.headers = event.headers || {};
		return response;
	}

	private catchError(err: any, response: Response, callback: Function) {
		console.log(err);
		if (err.error && err.statusCode) {
			response.setStatusCode(err.statusCode);
			response.json(err.error);
		} else {
			response.setStatusCode(500);
			response.json(err.body ? err.body : (err.message ? err.message : err));
		}
		callback(null, response.getResponse());
	}

	public handler = (finalHandler: (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>) => async (event: LambdaRequest<any>, context: APIGatewayEventRequestContext, callback: Function) => {
		const response = this.preHandle(event, context);
		try {
			await this.chainMiddlewares(this.middlewares, response, finalHandler)(event, context);
			callback(null, response.getResponse());
		} catch (err) {
			this.catchError(err, response, callback);
		}
	};

	public classHandler = (classHandler: any, name: string) => async (event: LambdaRequest<any>, context: APIGatewayEventRequestContext, callback: Function) => {
		const response = this.preHandle(event, context);
		try {
			await this.chainMiddlewares(this.middlewares, response, (event, response, context) => {
				const obj = new classHandler(event, response);
				return obj[name].apply(obj, [event, response, obj]);
			})(event, context);
			callback(null, response.getResponse());
		} catch (err) {
			this.catchError(err, response, callback);
		}
	};

	public add(exports: any, name: string, handler: (event: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => Promise<any>) {
		exports[name] = this.handler(handler);
	}

	public addClass(exports: any, name: string, handler: Function) {
		exports[name] = this.classHandler(handler, name);
	}
}

export class Response {
	private _statusCode: number = 0;

	private _body: any = null;

	private _headers: any = null;
	private _encodeToBase64: boolean = false;

	constructor(private req: APIGatewayProxyEvent) {
	}

	public setHeader(name: string, value: string) {
		if (!this._headers) {
			this._headers = {}
		}
		this._headers[name] = value ? value.toString() : "";
	}

	public setStatusCode(value: number) {
		this._statusCode = value;
	}

	public setBody(body: any, encodeToBase64: boolean = false) {
		if (!this._statusCode) {
			this._statusCode = 200;
		}
		this._encodeToBase64 = encodeToBase64;
		this._body = body;
	}

	public getBody() {
		return this._body;
	}

	public json(body: any) {
		this.setBody(JSON.stringify(body));
	}

	public getBodyByStatus() {
		if (this._statusCode >= 200 && this._statusCode < 300) {
			return "OK";
		}
		if (this._statusCode >= 400) {
			return "Error"
		}
		return null;
	}

	public getResponse() {
		let body = this._body;
		if (body && this._encodeToBase64) {
			body = body.toString("base64");
		}
		return {
			statusCode: this._statusCode || 200,
			body: body || this.getBodyByStatus(),
			isBase64Encoded: this._body && this._encodeToBase64,
			headers: this._headers
		};
	}

	public clearCookie(name: string, options: any) {
		let opts = {
			...options,
			expires: new Date(1),
			path: '/'
		};
		return this.cookie(name, '', opts);
	}

	public send(res: any) {
		this.setBody(res);
	}

	public redirect(url: string, statusCode: number = 302) {
		this._body = "";
		// Respond
		this._statusCode = statusCode;
		this.setHeader('Content-Length', "0");
		this.setHeader('Location', url);
	}

	public cookie(name: string, value: string, options: any) {
		const signed: boolean = options.signed || false;
		const secret: string = (<any>this.req).secret;
		let opts: any = {
			...options
		};
		if (signed && !secret) {
			throw new Error('cookieParser("secret") required for signed cookies');
		}

		let val = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

		if (signed) {
			val = 's:' + sign(val, secret);
		}

		if ('maxAge' in options) {
			opts.expires = new Date(Date.now() + opts.maxAge);
			opts.maxAge /= 1000;
		}

		if (opts.path == null) {
			opts.path = '/';
		}

		this.setHeader('Set-Cookie', cookie.serialize(name, String(val), opts));

		return this;
	}
}

export abstract class AbstractMiddleware<T> {

	public async execute(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, next: Function) {
		try {
			const request = event as LambdaRequest<T>
			await this.before(request, context, response);
			const result = next(request, context);
			await this.after(request, context, response);
			return result;
		} catch (err) {
			this.error(event, context, response, err);
		}
	}

	protected async abstract before(event: LambdaRequest<T>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;

	protected async abstract after(event: LambdaRequest<T>, context: APIGatewayEventRequestContext, response: Response): Promise<void>;

	protected error(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response, err: Error) {
		console.log(err);
		response.setStatusCode(500);
		response.setBody({message: err.message});
	}
}

export interface LambdaRequest<T> extends APIGatewayProxyEvent {
	json: T;
	// used for signing cookies
	secret: string;
}