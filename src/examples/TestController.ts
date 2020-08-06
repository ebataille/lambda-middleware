import {Controller, Method, query, response} from "../Annotations";
import {Router, Response} from "../middleware/Router";


@Controller({router: new Router([]), exports, json: true})
export class TestController {

	foo: string = "bar";


	private static readonly STATIC_PROPERTY: string = "STATIC_PROPERTY";

	@Method()
	async test() {
		console.log(this);
		return this.doSomething()
	}

	@Method()
	async testQuery(@query() name: string, @query() age: number) {
		return {name, age};
	}

	@Method({noResponse: true})
	async noResponse(@response response: Response) {
		response.redirect("https://www.example.com");
	}

	doSomething() {
		return {hello: this.foo, staticProp: TestController.STATIC_PROPERTY};
	}
}