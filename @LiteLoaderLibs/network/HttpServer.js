import { HttpClient } from "java.net.http.HttpClient";
import { HttpRequest } from "java.net.http.HttpRequest";
import { HttpResponse } from "java.net.http.HttpResponse";
import { URI } from "java.net.URI";

import { HttpServer as JHttpServer } from "com.sun.net.httpserver.HttpServer"
import { HttpHandler } from "./HttpHandler.js"

import { InetSocketAddress } from "java.net.InetSocketAddress"
import { Executors } from "java.util.concurrent.Executors"

export class HttpServer {
    constructor() {
        this.handler = new HttpHandler();
    }
    on(method, path, callback) {
        this.handler.on(method, new RegExp(["^",path,"$"].join(""), "g"), callback)
        return this;
    }
    onGet(path, callback) {
        return this.on("GET", path, callback);
    }
    onPut(path, callback) {
        return this.on("PUT", path, callback);
    }
    onPost(path, callback) {
        return this.on("POST", path, callback);
    }
    onPatch(path, callback) {
        return this.on("PATCH", path, callback);
    }
    onDelete(path, callback) {
        return this.on("DELETE", path, callback);
    }
    onOptions(path, callback) {
        return this.on("POTIONS", path, callback);
    }
    onPreRouting(callback) {
        return this.on("PREROUTING", path, callback);
    }
    onPostRouting(callback) {
        return this.on("POSTROUTING", path, callback);
    }
    onError(callback) {
        return this.on("ERROR", path, callback);
    }
    onException(callback) {
        return this.on("EXCEPTION", path, callback);
    }
    listen(addr, port = 8080) {
        let inet = new InetSocketAddress(port);
        if (addr) inet = new InetSocketAddress(addr, port);
        this.server = JHttpServer.create(inet, 0);
        this.server.start();//启动服务器
        //创建一个HttpContext，将路径为/myserver请求映射到MyHttpHandler处理器
        this.server.createContext("/", this.handler);
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




