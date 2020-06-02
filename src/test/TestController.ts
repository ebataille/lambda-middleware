import {Controller, Method} from "../Annotations";
import {Router} from "../middleware/Router";


@Controller({exports, router: new Router([]), json: true})
class TestController {

	foo: string = "bar"

	@Method()
	async test() {
		console.log(this);
		return this.doSomething()
	}

	doSomething() {
		return {hello: this.foo};
	}
}