import {Controller, Method, query} from "../Annotations";
import {Router} from "../middleware/Router";


@Controller({exports, router: new Router([]), json: true})
class TestController {

	foo: string = "bar";

	private static readonly STATIC_PROPERTY: string = "STATIC_PROPERTY";

	@Method()
	async test() {
		console.log(this);
		return this.doSomething()
	}

	@Method()
	async testQuery(@query() name: string, @query("age", "float") age: number) {
		return {name, age};
	}

	doSomething() {
		return {hello: this.foo, staticProp: TestController.STATIC_PROPERTY};
	}
}