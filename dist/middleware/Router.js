"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie = require("cookie");
const cookie_signature_1 = require("cookie-signature");
class Router {
    constructor(middlewares = []) {
        this.middlewares = middlewares;
        this.handler = (finalHandler, preMiddlewares = [], postMiddlewares = []) => async (event, context, callback) => {
            const response = this.preHandle(event, context);
            try {
                const fullMiddlewares = preMiddlewares.concat(this.middlewares, postMiddlewares);
                await this.chainMiddlewares(fullMiddlewares, response, finalHandler)(event, context);
                callback(null, response.getResponse());
            }
            catch (err) {
                this.catchError(err, response, callback);
            }
        };
        this.classHandler = (classHandler, name, preMiddlewares = [], postMiddlewares = []) => async (event, context, callback) => {
            const response = this.preHandle(event, context);
            try {
                const fullMiddlewares = preMiddlewares.concat(this.middlewares, postMiddlewares);
                await this.chainMiddlewares(fullMiddlewares, response, (event, response, context) => {
                    const obj = new classHandler(event, response);
                    return obj[name].apply(obj, [event, response, obj]);
                })(event, context);
                callback(null, response.getResponse());
            }
            catch (err) {
                this.catchError(err, response, callback);
            }
        };
    }
    chainMiddlewares([firstMiddleware, ...rest], response, finalHandler) {
        if (firstMiddleware) {
            return (event, context) => {
                try {
                    return firstMiddleware.execute(event, context, response, this.chainMiddlewares(rest, response, finalHandler));
                }
                catch (error) {
                    return Promise.reject(error);
                }
            };
        }
        return (event, context) => {
            if (event.httpMethod === "OPTIONS") {
                return;
            }
            return finalHandler(event, response, context);
        };
    }
    preHandle(event, context) {
        const response = new Response(event);
        context.callbackWaitsForEmptyEventLoop = false;
        event.queryStringParameters = event.queryStringParameters || {};
        event.pathParameters = event.pathParameters || {};
        event.headers = event.headers || {};
        return response;
    }
    catchError(err, response, callback) {
        console.log(err);
        if (err.error && err.statusCode) {
            response.setStatusCode(err.statusCode);
            response.json(err.error);
        }
        else {
            response.setStatusCode(500);
            response.json(err.body ? err.body : (err.message ? err.message : err));
        }
        callback(null, response.getResponse());
    }
    add(exports, name, handler, preMiddlewares, postMiddlewares) {
        exports[name] = this.handler(handler, preMiddlewares, postMiddlewares);
    }
    addClass(exports, name, handler, preMiddlewares, postMiddlewares) {
        exports[name] = this.classHandler(handler, name, preMiddlewares, postMiddlewares);
    }
}
exports.Router = Router;
class Response {
    constructor(req) {
        this.req = req;
        this._statusCode = 0;
        this._body = null;
        this._headers = null;
        this._encodeToBase64 = false;
    }
    setHeader(name, value) {
        if (!this._headers) {
            this._headers = {};
        }
        this._headers[name] = value ? value.toString() : "";
    }
    setStatusCode(value) {
        this._statusCode = value;
    }
    setBody(body, encodeToBase64 = false) {
        if (!this._statusCode) {
            this._statusCode = 200;
        }
        this._encodeToBase64 = encodeToBase64;
        this._body = body;
    }
    getBody() {
        return this._body;
    }
    json(body) {
        this.setBody(JSON.stringify(body));
    }
    getBodyByStatus() {
        if (this._statusCode >= 200 && this._statusCode < 300) {
            return "OK";
        }
        if (this._statusCode >= 400) {
            return "Error";
        }
        return null;
    }
    getResponse() {
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
    clearCookie(name, options) {
        let opts = {
            ...options,
            expires: new Date(1),
            path: '/'
        };
        return this.cookie(name, '', opts);
    }
    send(res) {
        this.setBody(res);
    }
    redirect(url, statusCode = 302) {
        this._body = "";
        // Respond
        this._statusCode = statusCode;
        this.setHeader('Content-Length', "0");
        this.setHeader('Location', url);
    }
    cookie(name, value, options) {
        const signed = options.signed || false;
        const secret = this.req.secret;
        let opts = {
            ...options
        };
        if (signed && !secret) {
            throw new Error('cookieParser("secret") required for signed cookies');
        }
        let val = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);
        if (signed) {
            val = 's:' + cookie_signature_1.sign(val, secret);
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
exports.Response = Response;
class AbstractMiddleware {
    async execute(event, context, response, next) {
        try {
            const request = event;
            await this.before(request, context, response);
            const result = await next(request, context);
            await this.after(request, context, response);
            return result;
        }
        catch (err) {
            await this.error(event, context, response, err);
            throw err;
        }
    }
    error(event, context, response, err) {
        console.log(err);
        response.setStatusCode(500);
        response.setBody({ message: err.message });
    }
}
exports.AbstractMiddleware = AbstractMiddleware;
//# sourceMappingURL=Router.js.map