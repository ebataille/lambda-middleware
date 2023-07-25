export declare class LambdaError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
    get error(): {
        message: string;
    };
}
