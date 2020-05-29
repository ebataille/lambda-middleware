/**
 * Created by BATAILLE on 18/08/2017.
 */
module.exports = {
	annotations: require("./dist/ExpressAnnotations"),
	bodyParser: require("./dist/middleware/BodyParserMiddleware"),
	cookieParser: require("./dist/middleware/CookieParser"),
	gzip: require("./dist/middleware/GzipMiddleware"),
	router: require("./dist/middleware/Router")
};