/*
Copyright 2020 Edouard Bataille

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import { AbstractMiddleware } from "./Router";
import * as cookieParser from "cookie-parser";
export class CookieParser extends AbstractMiddleware {
    constructor(secret) {
        super();
        this.parser = cookieParser(secret);
    }
    async after(event, context, response) {
    }
    async before(event, context, response) {
        if (event.headers) {
            this.parser(event, {}, () => {
            });
        }
    }
}
//# sourceMappingURL=CookieParser.js.map