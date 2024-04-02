export default class ClassController {
    static setupClass(router, classHandler, name, preMiddlewares = [], postMiddlewares = []) {
        this.handlers.set(name, router.addClass(classHandler, name, preMiddlewares, postMiddlewares));
    }
    static async handleRequest(req, res) {
        const handler = this.handlers.get(req.path);
        if (handler) {
            await handler(req, res);
        }
    }
}
ClassController.handlers = new Map();
//# sourceMappingURL=ClassController.js.map