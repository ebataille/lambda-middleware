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
}
const router = new Router_1.Router([new BodyParserMiddleware_1.BodyParserMiddleware()]);
router.addClass(exports, "echo", ClassControllerExample);
//# sourceMappingURL=ClassControllerExample.js.map