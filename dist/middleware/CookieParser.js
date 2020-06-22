"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const Router_1 = require("./Router");
const cookieParser = require("cookie-parser");
class CookieParser extends Router_1.AbstractMiddleware {
    constructor(secret) {
        super();
        this.parser = cookieParser(secret);
    }
    after(event, context, response) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    before(event, context, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.headers) {
                this.parser(event, {}, () => {
                });
            }
        });
    }
}
exports.CookieParser = CookieParser;
//# sourceMappingURL=CookieParser.js.map