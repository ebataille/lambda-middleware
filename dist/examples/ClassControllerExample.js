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
const Router_1 = require("../middleware/Router");
const BodyParserMiddleware_1 = require("../middleware/BodyParserMiddleware");
class ClassControllerExample {
    constructor(req, response) {
        // Here we can initialize our class with the request if needed
    }
    echo(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.json);
            response.json(Object.assign({}, req.json));
        });
    }
}
const router = new Router_1.Router([new BodyParserMiddleware_1.BodyParserMiddleware()]);
router.addClass(exports, "echo", ClassControllerExample);
//# sourceMappingURL=ClassControllerExample.js.map