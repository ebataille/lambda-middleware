# @igloobuster/aws_lambda_middleware
Middleware and annotations in typescript for AWS lambda

[![NPM](https://nodei.co/npm/@igloobuster/aws_lambda_middleware.png)](https://www.npmjs.com/package/@igloobuster/aws_lambda_middleware)

## installations

```
npm install --save @igloobuster/aws_lambda_middleware
```

## Changelog
* v1.0.5
  * response.json() set ContentType automatically
* v1.0.4
  * Fix parsing argumentNames with default values
  
* v1.0.2
  * Add Pre and Post middlewares for methods

* v1.0.1
  * Bug Fix on Node12.19+, __proto__ made http_agent crash, change it by a Map and className

* v0.1.9
  * Bug Fix on noResponse
  * Bug Fix on missing location header on response.redirect

* v0.1.8
  * Bug Fix on boolean params that were not cast properly

* v0.1.7
  * Adding addClass to the router to have one class instance per request
  * Adding the annotation ClassController wich add a class to the router

## how It works

Lambda middleware provide a way to chain middleware for AWS lambda before executing the request

It provides body parser, middlewares and tools to build the response for aws

## Getting Started

### Declare handlers

You need to declare function to handle the lambda call.
I prefer using class but it's not mandatory

```typescript
import {LambdaRequest, Router, Response} from "@igloobuster/aws_lambda_middleware/dist/middleware/Router";
import {BodyParserMiddleware} from "@igloobuster/aws_lambda_middleware/dist/middleware/BodyParserMiddleware";


class HelloWorld {

	constructor(router: Router) {
		router.add(exports, "hello", (req: LambdaRequest<any>, response: Response) => this.hello(req, response))
	}

	private async hello(req: LambdaRequest<any>, response: Response) {
		response.json({hello: "world"});
	}
}

const router = new Router([new BodyParserMiddleware()]);
new HelloWorld(router);
```

And that's all you need to do, the router will export your function with the hello name and handle it with the middleware mechanism

In the LambdaRequest Object thanks to the BodyParserMiddleware you have access to the body of the request.
You also have access to all the path parameters and query strings.

For example :

```typescript
private async hello(req: LambdaRequest<any>, response: Response) {
	response.json({hello: req.pathParameters, body: req.json, age: req.queryStringParameters.age});
}
```

### Declare Class handlers (v0.1.7+)

If you need to have one instance per request you can use ```router.addClass``` instead of adding method.
You need to add every method inside your class in order to get it work

For example :

```typescript
import {Router, LambdaRequest, Response} from "@igloobuster/aws_lambda_middleware/dist/middleware/Router";
import {BodyParserMiddleware} from "@igloobuster/aws_lambda_middleware/dist/middleware/BodyParserMiddleware";

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
```

### Build your own middlewares

Let's say for example that you need to response with cors headers.

```typescript
import {Config} from "../helper/Config";
import {AbstractMiddleware, LambdaRequest, Response} from "@igloobuster/aws_lambda_middleware/dist/middleware/Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";


export class CorsMiddleware extends AbstractMiddleware<any> {

	protected async after(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response) {
		if (event.headers) {
			const origin = event.headers.origin || event.headers.Host || event.headers.host;
			if (origin === "https://example/com") {
				response.setHeader('Access-Control-Allow-Origin', origin);
				response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
				response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type, x-force-lang, cookie');
				response.setHeader('Access-Control-Expose-Headers', 'x-api-authorization, set-cookie, x-force-lang');
				response.setHeader('Access-Control-Allow-Credentials', 'true');
			}
		}
	}

	protected async before(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) {

	}
}
```

Here we have a before and after function where we can do what we need before or after the execution of the handler
In the after function here, we had some headers in the response to allow the CORS for the example.com domain

In our router we can now provide this new middleware:

```typescript
const router = new Router([new BodyParserMiddleware(), new CorsMiddleware()]);
new HelloWorld(router);
```

### Pre and Post middlewares

Sometime you need a method to have its own middlewares running before or after the class middlewares.<br/>
You can declare them like this :

```typescript
const router = new Router([new BodyParserMiddleware(), new CorsMiddleware()]);
new HelloWorld(router, [new PreMiddleware1(), new PreMiddleware2()], [new PostMiddleware1(), new PostMiddleware2()]);
```

## Annotations

The library also provides annotation to make it more easy to use

```typescript
import {BodyParserMiddleware} from "@igloobuster/aws_lambda_middleware/dist/middleware/BodyParserMiddleware";
import {Controller, custom, Method, param, query} from "@igloobuster/aws_lambda_middleware/dist/Annotations";
import {Router} from "@igloobuster/aws_lambda_middleware/dist/middleware/Router";

@Controller({exports, json: true, router: new Router([new BodyParserMiddleware()])})
export class HelloController {

	@Method()
	private async hello(@param() name: string, @query() age: number = 21) {
		return {hello: name, age};
	};
}
```

If you need to have on class instance per request use ```ClassController instead of controller```
```typescript
import {BodyParserMiddleware} from "@igloobuster/aws_lambda_middleware/dist/middleware/BodyParserMiddleware";
import {ClassController, Method, param, query} from "@igloobuster/aws_lambda_middleware/dist/Annotations";
import {Router, LambdaRequest, Response} from "@igloobuster/aws_lambda_middleware/dist/middleware/Router"; import {LambdaRequest} from "./Router";

@ClassController({exports, json: true, router: new Router([new BodyParserMiddleware()])})
export class HelloController {

    constructor (request : LambdaRequest<any>, response : Response) {
    	// do initialization of the class here 
    }

	@Method()
	private async hello(@param() name: string, @query() age: number = 21) {
		return {hello: name, age};
	};
}
```

The annotation will use the same class that we see before and will exports the hello method.
You now have to declare your parameters and the annotation will pass it for you.

Here are the annotations availables:

`@param`: it will search in the path parameters<br/>
`@query`: it will search in the query parameters<br/>
`@body`: it will give you the json body<br/>
`@custom`: it will give you a custom property contains in the request object<br/>
`@header`: If you specify a name, it will search for this specific params in the headers object, it will give you all the raw headers instead<br/>
`@request`: To have the full request object<br/>
`@response`: To have the full response object

