"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router_1 = require("../middleware/Router");
const BodyParserMiddleware_1 = require("../middleware/BodyParserMiddleware");
class ClassControllerExample {
    constructor(req, response) {
        // Here we can initialize our class with the request if needed
    }
    async echo(req, response) {
        console.log(req.json);
        response.json({ ...req.json });
    }
    async preAndPostMiddleware(req, response) {
        console.log(req.json);
        response.json({ ...req.json });
    }
}
class PreMiddleware extends Router_1.AbstractMiddleware {
    async after(event, context, response) {
        console.log("after called after other middlewares");
    }
    async before(event, context, response) {
        console.log("before called before other middlewares");
    }
}
class PostMiddleware extends Router_1.AbstractMiddleware {
    async after(event, context, response) {
        console.log("after called before other middlewares");
    }
    async before(event, context, response) {
        console.log("before called after other middlewares");
    }
}
const router = new Router_1.Router([new BodyParserMiddleware_1.BodyParserMiddleware()]);
router.addClass(exports, "echo", ClassControllerExample);
router.addClass(exports, "preAndPostMiddleware", ClassControllerExample, [new PreMiddleware()], [new PostMiddleware()]);
//# sourceMappingURL=ClassControllerExample.js.map