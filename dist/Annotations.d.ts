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
export declare function request(): (target: any, key: string, index: number) => void;
export declare function response(): (target: any, key: string, index: number) => void;
export declare function header(paramName: string): (target: any, key: string, index: number) => void;
export declare function param(paramName?: string): (target: any, key: string, index: number) => void;
export declare function body(): (target: any, key: string, index: number) => void;
export declare function query(paramName?: string): (target: any, key: string, index: number) => void;
export declare function custom(paramName: string): (target: any, key: string, index: number) => void;
