export declare class TestController {
    foo: string;
    private static readonly STATIC_PROPERTY;
    test(): Promise<{
        hello: string;
        staticProp: string;
    }>;
    testQuery(name: string, age: number): Promise<{
        name: string;
        age: number;
    }>;
    doSomething(): {
        hello: string;
        staticProp: string;
    };
}
