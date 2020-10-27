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
var TestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const Annotations_1 = require("../Annotations");
const Router_1 = require("../middleware/Router");
let TestController = TestController_1 = class TestController {
    constructor() {
        this.foo = "bar";
    }
    async test() {
        console.log(this);
        return this.doSomething();
    }
    async testQuery(name, age) {
        return { name, age };
    }
    async noResponse(response) {
        response.redirect("https://www.example.com");
    }
    doSomething() {
        return { hello: this.foo, staticProp: TestController_1.STATIC_PROPERTY };
    }
};
TestController.STATIC_PROPERTY = "STATIC_PROPERTY";
__decorate([
    Annotations_1.Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "test", null);
__decorate([
    Annotations_1.Method(),
    __param(0, Annotations_1.query()), __param(1, Annotations_1.query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "testQuery", null);
__decorate([
    Annotations_1.Method({ noResponse: true }),
    __param(0, Annotations_1.response),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Router_1.Response]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "noResponse", null);
TestController = TestController_1 = __decorate([
    Annotations_1.Controller({ router: new Router_1.Router([]), exports, json: true })
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=TestController.js.map