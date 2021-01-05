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
import {AbstractMiddleware, LambdaRequest, Response, Router} from "./middleware/Router";
import {APIGatewayEventRequestContext} from "aws-lambda";
import "reflect-metadata";

const METADATA_METHOD_KEY: string = "ea_metadata_";

export interface ControllerParams {
	exports: any;
	router: Router;
	json?: boolean;
}

export interface ControllerValues {
	json?: boolean;
	status?: boolean;
	noResponse?: boolean;
}

export interface Result {
	body: any;
	headers?: any[];
}

interface MetaData {
	defaultJson?: boolean;
	methods: Method[];
	isServerClass: Boolean;
}

interface Method {
	name: string;
	value: Function;
	preMiddlewares?: AbstractMiddleware<any>[];
	postMiddlewares?: AbstractMiddleware<any>[];
}

const metadataClass: Map<any, MetaData> = new Map();

export function ClassController<T extends any>(controllerParams: ControllerParams) {
	return (target: any) => {
		initClassTarget(target);
		const metadata = getMetadata(target);
		metadata.defaultJson = controllerParams.json;
		for (let subRoute of metadata.methods) {
			controllerParams.router.addClass(controllerParams.exports, subRoute.name, target, subRoute.preMiddlewares, subRoute.postMiddlewares);
		}
	}
}

export function Controller<T extends any>(controllerParams: ControllerParams) {
	return (target: any) => {
		const res = new target();
		initClassTarget(res);
		const metadata = getMetadata(target);
		metadata.defaultJson = controllerParams.json;
		for (let subRoute of metadata.methods) {
			controllerParams.router.add(controllerParams.exports, subRoute.name, async (req: LambdaRequest<any>, response: Response, context: APIGatewayEventRequestContext) => subRoute.value(req, response, res));
		}
	}
}

function getProperValue(value: string | null, targetType: string | Function) {
	if (!value) {
		return value;
	}
	if (typeof targetType === "function") {
		return targetType(value);
	}
	switch (targetType) {
		case "boolean":
			return value === "true";
		case "integer":
			return parseInt(value);
		case "float":
			return parseFloat(value);
		default:
			return value;
	}
}

function handleMethod<T extends any>(routeValues: ControllerValues, preMiddlewares: AbstractMiddleware<any>[] | undefined, postMiddlewares: AbstractMiddleware<any>[] | undefined, target: T, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<Result | any>> | undefined) {
	if (descriptor === undefined) {
		descriptor = Object.getOwnPropertyDescriptor(target, key);
	}
	if (!descriptor) {
		return;
	}
	let originalMethod = descriptor.value;
	let metadataKey = `${METADATA_METHOD_KEY}${key}`;
	// @ts-ignore
	if (!target[metadataKey]) {
		// @ts-ignore
		target[metadataKey] = [];
	}
	descriptor.value = (request: LambdaRequest<any>, response: Response, objectTarget: any): Promise<Result | any> => {
		let params = [];
		// @ts-ignore
		for (let p of target[metadataKey]) {
			switch (p.type) {
				case "params":
					params[p.index] = getProperValue(request.pathParameters && request.pathParameters[p.reqName], p.targetType);
					break;
				case "query":
					params[p.index] = getProperValue(request.queryStringParameters && request.queryStringParameters[p.reqName], p.targetType);
					break;
				case "request":
					params[p.index] = request;
					break;
				case "response":
					params[p.index] = response;
					break;
				case "body":
					params[p.index] = !!request.json ? request.json : request.body;
					break;
				case "header":
					if (p.reqName) {
						params[p.index] = request.headers[p.reqName];
					} else {
						params[p.index] = request.headers;
					}
					break;
				case "custom":
					params[p.index] = (<any>request)[p.reqName];
					break;
			}
		}

		return (<any>originalMethod).apply(objectTarget, params).then((result: Result | any) => {
			if (routeValues.noResponse) {
				return;
			}
			if (result.hasOwnProperty("headers")) {
				let headers = result["headers"];
				for (let prop in headers) {
					if (headers.hasOwnProperty(prop)) {
						response.setHeader(prop, headers[prop]);
					}
				}
			}
			if (routeValues.status) {
				response.setStatusCode(result && (result.hasOwnProperty("status") ? result.status : result));
			} else { // @ts-ignore

				if (routeValues.json || (getMetadata(target).defaultJson && !routeValues.noResponse)) {
					response.json(result && (result.hasOwnProperty("body") ? result.body : result));
				} else {
					response.send(result && (result.body ? result.body : result));
				}
			}
		});
	};
	initClassTarget(target);
	// @ts-ignore
	getMetadata(target).methods.push({
		name: key,
		value: descriptor.value,
		preMiddlewares,
		postMiddlewares
	});
	return descriptor;
}

export function Method<T extends any>(routeValues: ControllerValues = {}, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]) {
	return (target: T, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
		return handleMethod.apply(this, [routeValues, preMiddlewares, postMiddlewares, target, key, descriptor]);
	}
}

function getMetadata(target: any): MetaData {
	const name = target.name || target.constructor.name;
	return metadataClass.get(name)!;
}

function initClassTarget(target: any) {
	const name = target.name || target.constructor.name;
	if (!metadataClass.has(name)) {
		metadataClass.set(name, {methods: [], defaultJson: false, isServerClass: false});
	}
}

/**
 * get the @type LambdaRequest object
 */
export function request(target: any, key: string, index: number) {
	addProperty(target, key, index, "request");
}

/**
 * Get the @type Response object
 */
export function response(target: any, key: string, index: number) {
	addProperty(target, key, index, "response");
}

/**
 * Get an header property or if no paramName provided the full header object
 * @param paramName the name of the property to get (optional)
 */
export function header(paramName?: string) {
	return (target: any, key: string, index: number) => {
		addProperty(target, key, index, "header", paramName);
	}
}

/**
 * Get a path parameter property, the parameter will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export function param(paramName?: string) {
	return (target: any, key: string, index: number) => {
		const type = getType(target, key, index);
		let _paramName = paramName;
		if (!_paramName) {
			_paramName = getParamNames(target[key])[index];
		}
		addProperty(target, key, index, "params", _paramName, type);
	}
}

/**
 * get the body of the request, if the body is a json, return the json, the plain text else
 */
export function body(target: any, key: string, index: number) {
	addProperty(target, key, index, "body");
}

/**
 * Get a query property, the property will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export function query(paramName?: string) {
	return (target: any, key: string, index: number) => {
		let type = getType(target, key, index);
		let _paramName = paramName;
		if (!_paramName) {
			_paramName = getParamNames(target[key])[index];
		}
		addProperty(target, key, index, "query", _paramName, type);
	}
}

/**
 * Get a property inside the request handled by the middleware
 * @param paramName The name of the property to get
 */

export function custom(paramName?: string) {
	return (target: any, key: string, index: number) => {
		let _paramName = paramName;
		if (!_paramName) {
			_paramName = getParamNames(target[key])[index];
		}
		addProperty(target, key, index, "custom", _paramName);
	}
}

function getType<T>(target: T, key: string, index: number) {
	let type = null;
	if (Reflect.hasMetadata("design:paramtypes", target, key)) {
		const types = Reflect.getMetadata("design:paramtypes", target, key);
		if (types.length > index) {
			// exception for Boolean because Boolean("false") === true
			type = types[index] === Boolean ? "boolean" : types[index];
		}
	}
	return type;
}

function addProperty(target: any, key: string, index: number, type: string, reqName?: string, targetType: string | Function = "string") {
	let metadataKey = `${METADATA_METHOD_KEY}${key}`;
	if (!target[metadataKey]) {
		target[metadataKey] = [];
	}
	target[metadataKey].push({index: index, reqName: reqName, type: type, targetType});
}

// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically/9924463#9924463
function getParamNames(func: Function) {
	let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
	let ARGUMENT_NAMES = /([^\s,]+)/g;
	let fnStr = func.toString().replace(STRIP_COMMENTS, '');
	let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
}