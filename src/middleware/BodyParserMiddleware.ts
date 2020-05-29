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
import {AbstractMiddleware, LambdaRequest, Response} from "./Router";
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";

export class BodyParserMiddleware extends AbstractMiddleware<any> {

	protected async after(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, response: Response) {

	}

	protected async before(event: LambdaRequest<any>, context: APIGatewayEventRequestContext, response: Response) {
		let contentType = event.headers ? event.headers["Content-Type"] || event.headers["content-type"] : null;
		if (contentType && contentType.indexOf("application/json") !== -1 && event.body) {
			(event as LambdaRequest<any>).json = JSON.parse(event.body);
		}
	}
}