import {AbstractMiddleware, Router} from "./Router.js";

export default class Controller {
    static handlers: Map<string, Function> = new Map();

    public static setupClass(router: Router, classHandler: any, name: string, preMiddlewares: AbstractMiddleware<any>[] = [], postMiddlewares: AbstractMiddleware<any>[] = []) {
        this.handlers.set(name, router.addClass(classHandler, name, preMiddlewares, postMiddlewares));
    }

    static async handleRequest(req: any, res: any) {
        const handler = this.handlers.get(req.path);
        if (handler) {
            await handler(req, res);
        }
    }
}
