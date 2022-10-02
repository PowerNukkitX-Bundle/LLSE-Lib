import { BufferedReader } from "java.io.BufferedReader";
import { InputStreamReader } from "java.io.InputStreamReader";
import { StringBuffer } from "java.lang.StringBuffer";

function strToUtf8Bytes(str) {
    const utf8 = [];
    for (let ii = 0; ii < str.length; ii++) {
        let charCode = str.charCodeAt(ii);
        if (charCode < 0x80) utf8.push(charCode);
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
        } else {
            ii++;
            // Surrogate pair:
            // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
            // splitting the 20 bits of 0x0-0xFFFFF into two halves
            charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
            utf8.push(
                0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f),
            );
        }
    }
    //兼容汉字，ASCII码表最大的值为127，大于127的值为特殊字符
    for (let jj = 0; jj < utf8.length; jj++) {
        var code = utf8[jj];
        if (code > 127) {
            utf8[jj] = code - 256;
        }
    }
    return utf8;
}

export class HttpHandler {
    constructor() {
    }

    handle(httpExchange) {
        let version = "HTTP/114.514";
        let URI = httpExchange.getRequestURI();
        let reqHeaders = httpExchange.getRequestHeaders();
        let reqHeadersData = reqHeaders.values().toArray();
        let headers = {}
        reqHeaders.keySet().toArray().forEach((data, i) => headers[data] = reqHeadersData[i]);
        let request = {
            method: httpExchange.getRequestMethod(),
            remoteAddr: httpExchange.getRemoteAddress().getHostName(),
            remotePort: httpExchange.getRemoteAddress().getPort(),
            path: URI.getPath(),
            query: URI.getQuery(), headers,
            params: URI.getQuery(), version,

        }
        if (request.method == "GET") {
            request.body = URI.getQuery();
        } else {
            //此段逻辑无测试 哪天报错在找我
            let buffer = new BufferedReader(new InputStreamReader(httpExchange.getRequestBody(), "utf-8"))
            let content = new StringBuffer();
            let line = null
            while ((line = buffer.readLine()) != null) content.append(line);
            request.body = content.toString();
        }
        //----------------------query处理-----------------------------
        if (request.query) {
            let list = request.query.split("&");
            request.query = {}
            if (list.length == 1) {
                let value = list[0].split("=")
                if (value.length == 1) {
                    request.query = value[0]
                } else request.query[value[0]] = value[1]

            } else {
                list.forEach(data => {
                    data = data.split("=");
                    request.query[data[0]] = data[1]
                })
            }
            request.params = request.query;
        }
        // ------------以上为req-----------------
        // -------------res!----------------------------------------------
        let resHeaders = httpExchange.getResponseHeaders();
        let response = {
            status: 114511,
            headers: {},
            version,
            reason: "PI YAN ZI BU GO DA!",
            body: new StringBuffer(),
            /**
             *
             * @param  {...any} content
             * @returns {response} response
             */
            write: function (...content) {
                response.body.append(content.join(""));
                return response
            },
            /**
             *
             * @param {string} key
             * @param {string} value
             * @returns {response} response
             */
            setHeader: function (key, value) {
                resHeaders.set(key, value);
                headers[key] = value;
                return response
            },
            /**
             *
             * @param {string|java} key
             * @returns {array} array
             */
            getHeader(key) {
                let resh = resHeaders.get(key)?.toArray()
                return resh ? resh : [];
            },
        }
        // ----------------------事件处理-----------------------------------
        if (this[request.method]?.length) {
            for (let i = 0; i < this[request.method].length; i++) {
                let [path, callback] = this[request.method][i];
                if (request.path.match(path)) {
                    request.matches = request.path.match(path);//请求路径正则匹配结果
                    try {
                        let PRE = true
                        if (this.PREROUTING?.length) {
                            this.PREROUTING.forEach(i => {
                                if (i[1](request, response) === false) PRE = false;
                            })
                        }

                        if (PRE) callback(request, response);
                        let resBody = httpExchange.getResponseBody()
                        let byte = strToUtf8Bytes(response.body.toString())
                        httpExchange.sendResponseHeaders(response.status, byte.length)
                        resBody.write(byte)
                        resBody.flush();
                        resBody.close();
                        if (this.POSTROUTING?.length) {
                            this.POSTROUTING.forEach(i => i[1](request, response));
                        }
                        if (response.status >= 400 && this.ERROR?.length) {
                            this.ERROR.forEach(i => i[1](request, response))
                        }
                    } catch (error) {
                        if (this.EXCEPTION?.length) {
                            this.EXCEPTION.forEach(i => i[1](request, response, error))
                        }
                    }
                    break;
                }
            }

        }
        // console.log(request, "发生处理");
    }

    on(method, path, callback) {
        if (this[method] == undefined) this[method] = [];
        this[method].push([path, callback]);
    }

    get IsReusable() {
        return true
    }//可复用？
}
