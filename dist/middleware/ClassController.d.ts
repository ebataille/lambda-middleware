import { AbstractMiddleware, Router } from "./Router.js";
export default class ClassController {
    static handlers: Map<string, Function>;
    static setupClass(router: Router, classHandler: any, name: string, preMiddlewares?: AbstractMiddleware<any>[], postMiddlewares?: AbstractMiddleware<any>[]): void;
    static handleRequest(req: any, res: any): Promise<void>;
}
