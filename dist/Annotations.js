"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const METADATA_CLASS_KEY = "ea_metadata_class";
const METADATA_METHOD_KEY = "ea_metadata_";
function Controller(controllerParams) {
    return (target) => {
        let original = target;
        function construct(constructor, args) {
            let c = function () {
                return new constructor(args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        let f = function (...args) {
            initClassTarget(original.prototype);
            original.prototype[METADATA_CLASS_KEY].defaultJson = controllerParams.json;
            let res = construct(original, args);
            for (let subRoute of original.prototype[METADATA_CLASS_KEY].methods) {
                console.log(controllerParams, subRoute);
                controllerParams.router.add(controllerParams.exports, subRoute.name, (req, response, context) => __awaiter(this, void 0, void 0, function* () { return subRoute.value(req, response); }));
            }
            return res;
        };
        f.prototype = original.prototype;
        f();
        return f;
    };
}
exports.Controller = Controller;
function handleMethod(routeValues, target, key, descriptor) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    if (!descriptor) {
        return;
    }
    let originalMethod = descriptor.value;
    let metadataKey = `${METADATA_METHOD_KEY}${key}`;
    if (!target[metadataKey]) {
        target[metadataKey] = [];
    }
    descriptor.value = (request, response, objectTarget) => {
        let params = [];
        for (let p of target[metadataKey]) {
            switch (p.type) {
                case "params":
                    params[p.index] = request.pathParameters && request.pathParameters[p.reqName];
                    break;
                case "query":
                    params[p.index] = request.queryStringParameters && request.queryStringParameters[p.reqName];
                    break;
                case "request":
                    params[p.index] = request;
                    break;
                case "response":
                    params[p.index] = response;
                    break;
                case "body":
                    params[p.index] = request.json;
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
            else if (routeValues.json || (target[METADATA_CLASS_KEY].defaultJson && !routeValues.noResponse)) {
                response.json(result && (result.hasOwnProperty("body") ? result.body : result));
            }
            else if (!routeValues.noResponse) {
                response.send(result && (result.body ? result.body : result));
            }
        });
    };
    initClassTarget(target);
    target[METADATA_CLASS_KEY].methods.push({
        name: key,
        value: descriptor.value
    });
    return descriptor;
}
function Method(routeValues = {}) {
    return (target, key, descriptor) => {
        return handleMethod.apply(this, [routeValues, target, key, descriptor]);
    };
}
exports.Method = Method;
function initClassTarget(target) {
    if (!target[METADATA_CLASS_KEY]) {
        target[METADATA_CLASS_KEY] = { methods: [], defaultJson: false, isServerClass: false };
    }
}
function ERequest() {
    return (target, key, index) => {
        addProperty(target, key, index, "request");
    };
}
exports.ERequest = ERequest;
function EResponse() {
    return (target, key, index) => {
        addProperty(target, key, index, "response");
    };
}
exports.EResponse = EResponse;
function EHeader(paramName) {
    return (target, key, index) => {
        addProperty(target, key, index, "header", paramName);
    };
}
exports.EHeader = EHeader;
function param(paramName) {
    return (target, key, index) => {
        let _paramName = paramName;
        if (!_paramName) {
            _paramName = getParamNames(target[key])[index];
        }
        addProperty(target, key, index, "params", _paramName);
    };
}
exports.param = param;
function body() {
    return (target, key, index) => {
        addProperty(target, key, index, "body");
    };
}
exports.body = body;
function query(paramName) {
    return (target, key, index) => {
        let _paramName = paramName;
        if (!_paramName) {
            _paramName = getParamNames(target[key])[index];
        }
        addProperty(target, key, index, "query", _paramName);
    };
}
exports.query = query;
function custom(paramName) {
    return (target, key, index) => {
        addProperty(target, key, index, "custom", paramName);
    };
}
exports.custom = custom;
function addProperty(target, key, index, type, reqName) {
    let metadataKey = `${METADATA_METHOD_KEY}${key}`;
    if (!target[metadataKey]) {
        target[metadataKey] = [];
    }
    target[metadataKey].push({ index: index, reqName: reqName, type: type });
}
// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically/9924463#9924463
function getParamNames(func) {
    let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
