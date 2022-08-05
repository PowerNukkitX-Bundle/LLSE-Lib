import { HttpClient } from "java.net.http.HttpClient";
import { HttpRequest } from "java.net.http.HttpRequest";
import { HttpResponse } from "java.net.http.HttpResponse";
import { URI } from "java.net.URI";

import { HttpServer as JHttpServer } from "com.sun.net.httpserver.HttpServer"
// import { HttpHandler } from "com.sun.net.httpserver.HttpHandler"

import { InetSocketAddress } from "java.net.InetSocketAddress"
import { Executors } from "java.util.concurrent.Executors"

export class HttpServer {
    constructor() {

    }
    request() {
        return {
            method: function () { },
            path: function () { },
            query: function () { },
            params: function () { },
            headers: function () { },
            body: function () { },
            remoteAddr: function () { },
            remotePort: function () { },
            version: 'HTTP/1.1',
            matches: [],
        }
    }
    response() {
        return {
            getHeader: function () { },
            setHeader: function () { },
            write: function () { },
            status: 114511,
            headers: {},
            body: "",
            version: 'HTTP/1.1',
            reason: "PI YAN ZI BU GO DA!"
        }
    }
    onGet(path, callback) {

    }
    onPut(path, callback) {

    }
    onPost(path, callback) {

    }
    onPatch(path, callback) {

    }
    onDelete(path, callback) {

    }
    onOptions(path, callback) {

    }
    onPreRouting(callback) {

    }
    onPostRouting(callback) {

    }
    onError(callback) {

    }
    onException(callback) {

    }
    listen(addr, port = 8080) {
        let inet = new InetSocketAddress(port);
        if (addr) inet = new InetSocketAddress(addr, port);
        this.server = JHttpServer.create(inet, 0)
        this.server.start();//启动服务器

        //创建一个HttpContext，将路径为/myserver请求映射到MyHttpHandler处理器
        class HttpHandler {
            constructor() {

            }
            handle(HttpExchange) {
                console.log(HttpExchange,"发生处理");
            }
            get IsReusable() { return true }
        }
        this.server.createContext("/", new HttpHandler());

        return this;
    }
    startAt(addr, port = 8080) {
        return this.listen(addr, port);
    }
    stop() { this.server.stop(); }
    isRunning() {

    }
    // static
};

/**
 * 发送一个异步HTTP(s) Get请求
 * @example
     httpGet("https://reqres.in/api/users/2", {
         aaa: "bbb"
     }, (status, result) => {
         console.log(status, result, "???");
     })
 * @param url {string} 待注册的命令
 * @param [header] {object} 请求头（包括 Get 请求Request header）
 * @param callback {Function} 当请求返回时执行的回调函数，用于回传HTTP(s)响应结果。
 *     注：参数callback的回调函数原型：function(status,result)
 *     status : Integer
 *     返回的HTTP(s)响应码，如200代表请求成功
 *     result : String
 *     返回的具体数据
 * @returns {boolean} 是否成功发送请求
 */
function httpGet(url, header, callback) {
    if (!callback) {
        callback = header;
        header = {};
    }
    let client = HttpClient.newHttpClient()
    let request = HttpRequest.newBuilder().uri(URI.create(url)).GET();
    for (let i in header) request.header(i, header[i]);
    let res = client.sendAsync(request.build(), HttpResponse.BodyHandlers.ofString())
    res.thenApply((res) => callback(res.statusCode(), res.body()));
}

/**
 * 发送一个异步HTTP(s) Post请求
 * @example
     httpPost("https://reqres.in/api/users/2", "dasdaw", "text/plain", (status, result) => {
         console.log(status, result, "???");
     })
 * @param url {string} 待注册的命令
 * @param header {object} 请求头（包括 Post 请求Request header）
 * @param data {string} 发送的数据
 * @param type {object} 发送的 Post 数据类型，形如 text/plain application/x-www-form-urlencoded 等
 * @param callback {Function} 当请求返回时执行的回调函数，用于回传HTTP(s)响应结果。
 *     注：参数callback的回调函数原型：function(status,result)
 *     status : Integer
 *     返回的HTTP(s)响应码，如200代表请求成功
 *     result : String
 *     返回的具体数据
 * @returns {boolean} 是否成功发送请求
 */
function httpPost(url, ...arg) {
    // header, data, type, callback
    if (arg.length === 3) {
        var [data, type, callback] = arg;
        var header = {}
    }
    if (arg.length === 4) {
        var [header, data, type, callback] = arg;
    }
    header["Content-Type"] = type;
    let client = HttpClient.newHttpClient()
    let request = HttpRequest.newBuilder().uri(URI.create(url)).POST(HttpRequest.BodyPublishers.ofString(data));
    for (let i in header) request.header(i, header[i]);
    let res = client.sendAsync(request.build(), HttpResponse.BodyHandlers.ofString())
    res.thenApply((res) => callback(res.statusCode(), res.body()));
}

export let network = { httpGet, httpPost }




