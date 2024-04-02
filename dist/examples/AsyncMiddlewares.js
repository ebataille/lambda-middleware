import { AbstractMiddleware } from "../middleware/Router";
export class AsyncMiddlewares extends AbstractMiddleware {
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
//# sourceMappingURL=AsyncMiddlewares.js.map