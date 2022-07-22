"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncMiddlewares = void 0;
const Router_1 = require("../middleware/Router");
class AsyncMiddlewares extends Router_1.AbstractMiddleware {
    constructor(count, timeout) {
        super();
        this.count = count;
        this.timeout = timeout;
    }
    async after(event, context, response) {
        console.log(this.count, "after is called");
    }
    async before(event, context, response) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(this.count, "middleware is  called");
                resolve();
            }, this.timeout);
        });
    }
    async error(event, context, response, err) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(this.count, "error is called");
                resolve();
            }, this.timeout);
        });
    }
}
exports.AsyncMiddlewares = AsyncMiddlewares;
//# sourceMappingURL=AsyncMiddlewares.js.map