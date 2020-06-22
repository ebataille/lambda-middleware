import { Router } from "./middleware/Router";
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
export declare function Controller<T extends any>(controllerParams: ControllerParams): (target: any) => any;
export declare function Method<T extends any>(routeValues?: ControllerValues): (target: T, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | undefined;
/**
 * get the @type LambdaRequest object
 */
export declare function request(): (target: any, key: string, index: number) => void;
/**
 * Get the @type Response object
 */
export declare function response(): (target: any, key: string, index: number) => void;
/**
 * Get an header property or if no paramName provided the full header object
 * @param paramName the name of the property to get (optional)
 */
export declare function header(paramName?: string): (target: any, key: string, index: number) => void;
/**
 * Get a path parameter property
 * @param paramName the name of the property to get (optional)
 * @param type can be boolean, integer or float, in case of boolean, it checks that the value equals "true", for integer it apply a parseInt, for float a parseFloat (optional)
 */
export declare function param(paramName?: string, type?: string): (target: any, key: string, index: number) => void;
/**
 * get the body of the request, if the body is a json, return the json, the plain text else
 */
export declare function body(): (target: any, key: string, index: number) => void;
/**
 * Get a query property
 * @param paramName the name of the property to get (optional)
 * @param type can be boolean, integer or float, in case of boolean, it checks that the value equals "true", for integer it apply a parseInt, for float a parseFloat (optional)
 */
export declare function query(paramName?: string, type?: string): (target: any, key: string, index: number) => void;
/**
 * Get a property inside the request handled by the middleware
 * @param paramName The name of the property to get
 */
export declare function custom(paramName: string): (target: any, key: string, index: number) => void;
