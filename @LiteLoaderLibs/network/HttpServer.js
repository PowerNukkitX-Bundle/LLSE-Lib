import { HttpClient } from "java.net.http.HttpClient";
import { HttpRequest } from "java.net.http.HttpRequest";
import { HttpResponse } from "java.net.http.HttpResponse";
import { URI } from "java.net.URI";
export class HttpServer {
    constructor() {
    }
    // static 
};
/**
 *  httpget 异步请求 （其实我更想让他同步
 * @param {String} url 
 * @param {object} header 
 * @param {function} callback 
 */
function httpGet(url, header, callback) {
    if (!callback) { callback = header; header = {}; }
    let client = HttpClient.newHttpClient()
    let request = HttpRequest.newBuilder().uri(URI.create(url)).GET();
    for (let i in header) request.header(i, header[i]);
    let res = client.sendAsync(request.build(), HttpResponse.BodyHandlers.ofString())
    res.thenApply((res) => callback(res.statusCode(), res.body()));
}
/**
 *  httpPost 异步请求 （其实我更想让他同步
 * @param {String} url 
 * @param {array} arg 多参  [,header],data ,type,callback
 * @param {object} header 
 * @param  {String} data
 * @param {String} type
 * @param {function} callback 
 */
function httpPost(url, ...arg) {
    // header, data, type, callback
    if (arg.length == 3) { var [data, type, callback] = arg; var header = {} }
    if (arg.length == 4) { var [header, data, type, callback] = arg; };
    header["Content-Type"] = type;
    let client = HttpClient.newHttpClient()
    let request = HttpRequest.newBuilder().uri(URI.create(url)).POST(HttpRequest.BodyPublishers.ofString(data));
    for (let i in header) request.header(i, header[i]);
    let res = client.sendAsync(request.build(), HttpResponse.BodyHandlers.ofString())
    res.thenApply((res) => callback(res.statusCode(), res.body()));
}

export let network = { httpGet, httpPost }
// httpGet("https://reqres.in/api/users/2", {
//     aaa: "bbb"
// }, (status, result) => {
//     console.log(status, result, "???");
// })
// httpPost("https://reqres.in/api/users/2", "dasdaw", "text/plain", (status, result) => {
//     console.log(status, result, "???");
// })