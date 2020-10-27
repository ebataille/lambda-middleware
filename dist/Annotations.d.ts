import { Router } from "./middleware/Router";
import "reflect-metadata";
export interface ControllerParams {
    exports: any;
    router: Router;
    json?: boolean;
}
export interface ControllerValues {
    json?: boolean;
    status?: boolean;
    noResponse?: boolean;
}
export interface Result {
    body: any;
    headers?: any[];
}
export declare function ClassController<T extends any>(controllerParams: ControllerParams): (target: any) => void;
export declare function Controller<T extends any>(controllerParams: ControllerParams): (target: any) => void;
export declare function Method<T extends any>(routeValues?: ControllerValues): (target: T, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | undefined;
/**
 * get the @type LambdaRequest object
 */
export declare function request(target: any, key: string, index: number): void;
/**
 * Get the @type Response object
 */
export declare function response(target: any, key: string, index: number): void;
/**
 * Get an header property or if no paramName provided the full header object
 * @param paramName the name of the property to get (optional)
 */
export declare function header(paramName?: string): (target: any, key: string, index: number) => void;
/**
 * Get a path parameter property, the parameter will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export declare function param(paramName?: string): (target: any, key: string, index: number) => void;
/**
 * get the body of the request, if the body is a json, return the json, the plain text else
 */
export declare function body(target: any, key: string, index: number): void;
/**
 * Get a query property, the property will be cast using the Reflect typescript library
 * @param paramName the name of the property to get (optional)
 */
export declare function query(paramName?: string): (target: any, key: string, index: number) => void;
/**
 * Get a property inside the request handled by the middleware
 * @param paramName The name of the property to get
 */
export declare function custom(paramName?: string): (target: any, key: string, index: number) => void;
