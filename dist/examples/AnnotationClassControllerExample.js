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
import { AbstractMiddleware, Response, Router } from "../middleware/Router";
import { BodyParserMiddleware } from "../middleware/BodyParserMiddleware";
import { body, ClassController, Method } from "../Annotations";
class PreMiddleware extends AbstractMiddleware {
    async after(event, context, response) {
        console.log("annotation after called after other middlewares");
    }
    async before(event, context, response) {
        console.log("annotation before called before other middlewares");
    }
}
class PostMiddleware extends AbstractMiddleware {
    async after(event, context, response) {
        console.log("annotation after called before other middlewares");
    }
    async before(event, context, response) {
        console.log("annotation before called after other middlewares");
    }
}
let AnnotationClassControllerExample = class AnnotationClassControllerExample {
    constructor(req, response) {
        // Here we can initialize our class with the request if needed
    }
    async echo() {
        await new Promise((resolve) => {
            const https = require('https');
            const options = {
                hostname: 'www.google.com',
                port: 443,
                path: '/',
                method: 'GET'
            };
            const req = https.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`);
                res.on('data', (d) => {
                    process.stdout.write(d);
                });
                res.on("end", () => {
                    resolve();
                });
            });
            req.on('error', (error) => {
                console.error(error);
            });
            req.end();
        });
        return { status: "OK" };
    }
    async preAndPostMiddleware(body) {
        return body;
    }
};
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnotationClassControllerExample.prototype, "echo", null);
__decorate([
    Method({}, [new PreMiddleware()], [new PostMiddleware()]),
    __param(0, body),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnotationClassControllerExample.prototype, "preAndPostMiddleware", null);
AnnotationClassControllerExample = __decorate([
    ClassController({ router: new Router([new BodyParserMiddleware()]), exports, json: true }),
    __metadata("design:paramtypes", [Object, Response])
], AnnotationClassControllerExample);
//# sourceMappingURL=AnnotationClassControllerExample.js.map