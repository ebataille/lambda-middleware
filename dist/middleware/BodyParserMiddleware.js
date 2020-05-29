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
const Router_1 = require("./Router");
class BodyParserMiddleware extends Router_1.AbstractMiddleware {
    after(event, context, response) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    before(event, context, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentType = event.headers ? event.headers["Content-Type"] || event.headers["content-type"] : null;
            if (contentType && contentType.indexOf("application/json") !== -1 && event.body) {
                event.json = JSON.parse(event.body);
            }
        });
    }
}
exports.BodyParserMiddleware = BodyParserMiddleware;
