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
import * as zlib from "zlib";
export class GzipMiddleware extends AbstractMiddleware {
    async after(event, context, response) {
        let acceptEncoding = event.headers['accept-encoding'];
        if (!acceptEncoding) {
            acceptEncoding = '';
        }
        let stream = null;
        if (/\bdeflate\b/.test(acceptEncoding)) {
            response.setHeader("Content-Encoding", "deflate");
            stream = zlib.createDeflate();
        }
        else if (/\bgzip\b/.test(acceptEncoding)) {
            response.setHeader("Content-Encoding", "gzip");
            stream = zlib.createGzip();
        }
        else if (/\bbr\b/.test(acceptEncoding)) {
            response.setHeader("Content-Encoding", "br");
            stream = zlib.createBrotliCompress();
        }
        let buffers = [];
        await new Promise((resolve, reject) => {
            if (stream) {
                stream.on("end", () => {
                    resolve();
                });
                stream.on("data", (chunk) => {
                    buffers.push(chunk);
                    resolve();
                });
                stream.on("error", (err) => {
                    reject(err);
                });
                stream.write(response.getBody());
            }
            else {
                reject(new Error("no streams attached"));
            }
        });
        let buffer = Buffer.concat(buffers);
        response.setBody(buffer, true);
    }
    async before(event, context, response) {
        response.setHeader("Vary", "Accept-Encoding");
    }
}
//# sourceMappingURL=GzipMiddleware.js.map