import "reflect-metadata";
import Controller from "./middleware/Controller.js";
const METADATA_METHOD_KEY = "ea_metadata_";
const metadataClass = new Map();
export function ClassController(controllerParams) {
    return (target) => {
        initClassTarget(target);
        const metadata = getMetadata(target);
        metadata.defaultJson = controllerParams.json;
        for (let subRoute of metadata.methods) {
            Controller.setupClass(controllerParams.router, subRoute.name, target, subRoute.preMiddlewares, subRoute.postMiddlewares);
        }
    };
}
function getProperValue(value, targetType) {
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
function handleMethod(routeValues, preMiddlewares, postMiddlewares, target, key, descriptor) {
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
    descriptor.value = (request, response, objectTarget) => {
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
                    }
                    else {
                        params[p.index] = request.headers;
                    }
                    break;
                case "custom":
                    params[p.index] = request[p.reqName];
                    break;
            }
        }
        return originalMethod.apply(objectTarget, params).then((result) => {
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
            }
            else { // @ts-ignore
                if (routeValues.json || (getMetadata(target).defaultJson && !routeValues.noResponse)) {
                    response.json(result && (result.hasOwnProperty("body") ? result.body : result));
                }
                else {
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
export function Method(routeValues = {}, preMiddlewares, postMiddlewares) {
    return (target, key, descriptor) => {
        return handleMethod.apply(this, [routeValues, preMiddlewares, postMiddlewares, target, key, descriptor]);
    };
}
function getMetadata(target) {
    const name = target.name || target.constructor.name;
    return metadataClass.get(name);
}
function initClassTarget(target) {
    const name = target.name || target.constructor.name;
    if (!metadataClass.has(name)) {
        metadataClass.set(name, { methods: [], defaultJson: false, isServerClass: false });
    }
}
/**
 * get the @type LambdaRequest object
 */
export function request(target, key, index) {
    addProperty(target, key, index, "request");
}
/**
 * Get the @type Response object
 */
export function response(target, key, index) {
    addProperty(target, key, index, "response");
}
/**
 * Get an header property or if no paramName provided the full header object
 * @param paramName the name of the property to get (optional)
 */
export function header(paramName) {
    return (target, key, index) => {
        addProperty(target, key, index, "header", paramName);
    };
}
/**
 * Get a path parameter property, the parameter will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export function param(paramName) {
    return (target, key, index) => {
        const type = getType(target, key, index);
        let _paramName = paramName;
        if (!_paramName) {
            _paramName = getParamNames(target[key])[index];
        }
        addProperty(target, key, index, "params", _paramName, type);
    };
}
/**
 * get the body of the request, if the body is a json, return the json, the plain text else
 */
export function body(target, key, index) {
    addProperty(target, key, index, "body");
}
/**
 * Get a query property, the property will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export function query(paramName) {
    return (target, key, index) => {
        let type = getType(target, key, index);
        let _paramName = paramName;
        if (!_paramName) {
            _paramName = getParamNames(target[key])[index];
        }
        addProperty(target, key, index, "query", _paramName, type);
    };
}
/**
 * Get a property inside the request handled by the middleware
 * @param paramName The name of the property to get
 */
export function custom(paramName) {
    return (target, key, index) => {
        let _paramName = paramName;
        if (!_paramName) {
            _paramName = getParamNames(target[key])[index];
        }
        addProperty(target, key, index, "custom", _paramName);
    };
}
function getType(target, key, index) {
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
function addProperty(target, key, index, type, reqName, targetType = "string") {
    let metadataKey = `${METADATA_METHOD_KEY}${key}`;
    if (!target[metadataKey]) {
        target[metadataKey] = [];
    }
    target[metadataKey].push({ index: index, reqName: reqName, type: type, targetType });
}
// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically/9924463#9924463
function getParamNames(func) {
    let STRIP_COMMENTS = /(\/\*([\s\S]*?)\*\/\n?)|(\/\/)(.*\n)?/mg;
    let ARGUMENT_NAMES = /(\w+)?(\s?=\s?.*)?/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let params = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'));
    let result = params.split(",").map(item => item.trim().replace(ARGUMENT_NAMES, "$1"));
    if (result === null) {
        result = [];
    }
    return result;
}
//# sourceMappingURL=Annotations.js.map