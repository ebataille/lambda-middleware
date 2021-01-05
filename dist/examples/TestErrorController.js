"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router_1 = require("../middleware/Router");
const Annotations_1 = require("../Annotations");
const AsyncMiddlewares_1 = require("./AsyncMiddlewares");
let TestErrorController = class TestErrorController {
    constructor(req, response) {
        // Here we can initialize our class with the request if needed
    }
    async echo(body) {
        console.log("ECHO");
        return { echo: body };
    }
    async error(body) {
        console.log("ERROR");
        throw { status: 500, message: body };
    }
};
__decorate([
    Annotations_1.Method(),
    __param(0, Annotations_1.body),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestErrorController.prototype, "echo", null);
__decorate([
    Annotations_1.Method(),
    __param(0, Annotations_1.body),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestErrorController.prototype, "error", null);
TestErrorController = __decorate([
    Annotations_1.ClassController({ json: true, exports, router: new Router_1.Router([new AsyncMiddlewares_1.AsyncMiddlewares(1, 5000), new AsyncMiddlewares_1.AsyncMiddlewares(2, 200), new AsyncMiddlewares_1.AsyncMiddlewares(3, 150)]) }),
    __metadata("design:paramtypes", [Object, Router_1.Response])
], TestErrorController);
//# sourceMappingURL=TestErrorController.js.map