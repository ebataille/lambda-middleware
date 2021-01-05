// const TestController = require("../../dist/examples/TestController").TestController;
// const test = new TestController();

// console.log(test);
require("../../dist/examples/TestController").testQuery({queryStringParameters: {name: "test", age: "24.25"}}, {}, (err, res) => {
	console.log("TestController.testQuery", err, res);
});

require("../../dist/examples/TestController").test({}, {}, (err, res) => {
	console.log("TestController.test", err, res);
});

require("../../dist/examples/TestController").noResponse({}, {}, (err, res) => {
	console.log("TestController.noResponse", err, res);
});

require("../../dist/examples/ClassControllerExample").echo({body: "{\"hello\": \"world!\"}", headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("ClassControllerExample.echo", err, res);
});

require("../../dist/examples/ClassControllerExample").preAndPostMiddleware({body: "{\"hello\": \"world!\"}", headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("ClassControllerExample.preAndPostMiddleware", err, res);
});

require("../../dist/examples/TestErrorController").echo({body: {name: "test", age: "24.25"}, headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("TestController.echo", err, res);
});

require("../../dist/examples/TestErrorController").error({body: {name: "test", age: "24.25"}, headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("TestController.error", err, res);
});
require("../../dist/examples/AnnotationClassControllerExample").echo({body: JSON.stringify({name: "test", age: "24.25"}), headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("AnnotationClassControllerExample.echo", err, res);
});

require("../../dist/examples/AnnotationClassControllerExample").preAndPostMiddleware({body: JSON.stringify({name: "test", age: "24.25"}), headers: {"Content-Type": "application/json"}}, {}, (err, res) => {
	console.log("AnnotationClassControllerExample.preAndPostMiddleware", err, res);
});
