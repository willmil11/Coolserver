#! /usr/bin/env node

var child_process = require("child_process");
var process = require("process");
var path = require("path");

var app = async function () {
    var easynodes;
    try {
        easynodes = require("easynodes");
    }
    catch (error) {
        //Try to require it another way
        var output = await child_process.execSync("npm root -g");
        output = output.toString().slice(0, output.toString().length - 1) + "/easynodes/"
        try {
            easynodes = require(output);
        }
        catch (error) {
            //Try to install vital dependency easynodes automatically
            var ended = false;
            var install = child_process.spawn("npm", ["install", "-g", "easynodes"]);
            install.on("exit", function (code) {
                if (code === 0) {
                    try {
                        easynodes = require("easynodes");
                        end = true;
                    }
                    catch (error) {
                        try {
                            easynodes = require(output);
                            end = true;
                        }
                        catch (error) {
                            console.error("[Readyserver] [Main] Missing vital dependency: easynodes. Impossible to install automatically.")
                            process.exit(1);
                        }
                    }
                }
                else {
                    console.error("[Readyserver] [Main] Missing vital dependency: easynodes. Impossible to install automatically.")
                    process.exit(1);
                }
            });
            while (!(ended)) {
                await wait(1);
            }
        }
    }

    easynodes.init();

    //Get process arguments
    var args = process.argv.slice(2);

    //Args:
    //Path-to-server-folder, port, logpath
    var serverPath = args[0];
    var port = args[1];
    var logpath = args[2];

    //Check if server path is valid
    if (serverPath == null) {
        console.error("[Readyserver] [Main] Missing server path argument.")
        console.error("[Readyserver] [Main] readyserver <path-to-server-folder> <port> <logpath>")
        process.exit(1);
    }
    else {
        if (port == null) {
            console.error("[Readyserver] [Main] Missing port argument.")
            console.error("[Readyserver] [Main] readyserver <path-to-server-folder> <port> <logpath>")
            process.exit(1);
        }
        else {
            if (logpath == null) {
                console.error("[Readyserver] [Main] Missing log path argument.")
                console.error("[Readyserver] [Main] readyserver <path-to-server-folder> <port> <logpath>")
                process.exit(1);
            }
        }
    }
    //Path to absolute
    serverPath = path.resolve(serverPath) + "/";
    if (!(easynodes.files.exists.sync(serverPath))) {
        console.error("[Readyserver] [Main] Server path doesn't exist.");
        process.exit(1);
    }
    //If not a folder 
    if (!(easynodes.files.getTypeOf.sync(serverPath) === "Folder")) {
        console.error("[Readyserver] [Main] Server path is not a folder.");
        process.exit(1);
    }
    logpath = path.resolve(logpath) + "/";
    if (!(easynodes.files.exists.sync(logpath))) {
        console.error("[Readyserver] [Main] Log path doesn't exist.");
        process.exit(1);
    }
    //If not a folder
    if (!(easynodes.files.getTypeOf.sync(logpath) === "Folder")) {
        console.error("[Readyserver] [Main] Log path is not a folder.");
        process.exit(1);
    }
    //Check if port is an integer
    if (isNaN(port)) {
        console.error("[Readyserver] [Main] Port must be an integer.");
        process.exit(1);
    }
    else {
        port = parseInt(port);
    }
    //Check if port is valid
    if (port < 0 || port > 65535) {
        console.error("[Readyserver] [Main] Port must be between 0 and 65535.");
        process.exit(1);
    }
    //Check if port is available
    try {
        await child_process.execSync("lsof -t -i :" + port);
        //Used
        console.error("[Readyserver] [Main] Port is already used.");
        process.exit(1);
    }
    catch (error) {
        //Free
    }

    console.log("[Readyserver] [Main] Checking if custom 404 page exists...");
    if (easynodes.files.exists.sync(serverPath + "404.html")) {
        console.log("[Readyserver] [Main] Custom 404 page exists, caching for quick serve...");
        var custom_404;
        try {
            custom_404 = `${easynodes.files.read.sync(serverPath + "404.html")}`;
            console.log("[Readyserver] [Main] Cached custom 404 page.");

            require("fs").watch(serverPath + "404.html", function (event, filename) {
                console.log("[Readyserver] [Main] Custom 404 page has been modified, updating cache...");
                try {
                    custom_404 = `${easynodes.files.read.sync(serverPath + "404.html")}`;
                    console.log("[Readyserver] [Main] Updated cache.");
                }
                catch (error) {
                    custom_404 = null;
                    console.error("[Readyserver] [Main] An error has occured while trying to update cache...");
                }
            });
        }
        catch (error) {
            custom_404 = null;
            console.error("[Readyserver] [Main] An error has occured while trying to cache custom 404 page...");
        }
    }
    else {
        var custom_404 = null;
        console.log("[Readyserver] [Main] Custom 404 page doesn't exist. It won't be cached. (Default 404 page will be used)");
    }

    var ids = {
        "list": [],
        "currentlength": 5
    }
    var genid = function () {
        //Generate a new id
        //If all possible ids for current length are used increment current length by one

        if (ids.list.length === Math.pow(10, ids.currentlength)) {
            ids.currentlength += 1;
        }

        var id = "";
        var index = 0;
        while (index < ids.currentlength) {
            id += Math.floor(Math.random() * 10);
            index += 1;
        }
        ids.list.push(id);

        return {
            "id": id,
            "index": ids.list.length - 1,
            "revoke": function () {
                ids.list.splice(this.index, 1);
                this.id = null
                this.index = null
                this.revoke = null;
            }
        }
    }

    var loggger = function (tolog) {
        try {
            tolog = JSON.stringify(tolog, null, 4);
        }
        catch (error) {
            console.error("[Readyserver] [Logger] An error has occured while trying to process log...");
            return;
        }
        //Write log as mm_dd_yyyy-hh_mm_ss_ms.json
        var date = new Date();
        var filename = date.getMonth() + "_" + date.getDate() + "_" + date.getFullYear() + "-" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds() + ".json";
        try {
            easynodes.files.write.write.sync(logpath + filename, tolog);
            console.log("[Readyserver] [Logger] Wrote log to " + logpath + filename + ".")
        }
        catch (error) {
            console.error("[Readyserver] [Logger] An error has occured while trying to write log...");
        }
    }

    var cache = {
        "pages": {
            "index": null
        }
    }

    if (!(custom_404 == null)) {
        cache.pages.custom_404 = custom_404;
    }

    console.log("[Readyserver] [Main] Checking if index page exists...");
    if (easynodes.files.exists.sync(serverPath + "index.html")) {
        console.log("[Readyserver] [Main] Index page exists caching for quick serve...");
        try {
            cache.pages.index = `${easynodes.files.read.sync(serverPath + "index.html")}`;
            console.log("[Readyserver] [Main] Cached index page.");
            require("fs").watch(serverPath + "index.html", function (event, filename) {
                console.log("[Readyserver] [Main] Index page has been modified, updating cache...");
                try{
                    cache.pages.index = `${easynodes.files.read.sync(serverPath + "index.html")}`;
                    console.log("[Readyserver] [Main] Updated cache.");
                }
                catch (error){
                    cache.pages.index = null;
                    console.error("[Readyserver] [Main] An error has occured while trying to update cache...");
                }
            });
        }
        catch (error) {
            console.error("[Readyserver] [Main] An error has occured while trying to cache index page...");
            cache.pages.index = null;
        }
    }
    else {
        console.log("[Readyserver] [Main] Index page doesn't exist. it won't be cached.");
    }

    easynodes.http.newServer(function (request) {
        var log = {};
        console.log("[Readyserver] [Main] Got new request, generating new process id...");
        var id = genid();
        log.processid = id.id;
        var prefix = function () {
            return "[Readyserver] [" + id.id + "] ";
        }
        console.log(prefix() + "Generated process id.");
        log.method = request.method;
        log.rawurl = request.url;
        console.log(prefix() + "Checking if request method is \"GET\"...");
        if (!(request.method === "GET")) {
            console.log(prefix() + "Request method is not \"GET\". Generating response...");
            var response = {
                "response": JSON.stringify({
                    "exit_code": 1,
                    "message": "405 - Request method is not \"GET\"."
                }, null, 4),
                "length": null
            }
            response.length = response.response.length;
            log.response = response;
            log.ContentType = "text/plain";
            log.HttpCode = 405;
            console.log(prefix() + "Generated response.");
            console.log(prefix() + "Sending response with HttpCode 405...");
            request.end(response.response, 405, { "Content-Type": "text/plain", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
            console.log(prefix() + "Sent response.");
            console.log(prefix() + "Request finished, writing log...");
            loggger(log);
            console.log(prefix() + "Revoking process id...")
            var tmp = JSON.parse(JSON.stringify(id));
            id.revoke();
            prefix = function () {
                return "[Readyserver] [" + tmp.id + "] ";
            }
            console.log(prefix() + "Revoked process id.");
            tmp = null;
            return;
        }
        else {
            console.log(prefix() + "Request method is \"GET\".");
            console.log(prefix() + "Checking if request url is \"/\"...");
            if (request.url === "/") {
                console.log(prefix() + "Request url is \"/\", editing it to \"/index.html\"...");
                request.url = "/index.html";
                log.url = request.url;
                console.log(prefix() + "Edited request url, processing request...");
            }
            else {
                log.url = request.url;
                console.log(prefix() + "Request url is not \"/\". Processing request...");
            }
            console.log(prefix() + "Checking if request url exists...");
            if (request.url === "/index.html") {
                console.log(prefix() + "Requested url is \"/index.html\". Checking if index page is cached...");
                if (!(cache.pages.index == null)) {
                    log.response = {
                        "response": cache.pages.index,
                        "length": cache.pages.index.length
                    }
                    log.HttpCode = 200;
                    console.log(prefix() + "Index page is cached. Sending cached page...");
                    request.end(log.response.response, log.HttpCode, { "Content-Type": "text/html", "Content-Length": log.response.length, "Access-Control-Allow-Origin": "*" });
                    console.log(prefix() + "Sent cached page.");
                    console.log(prefix() + "Request finished, writing log...");
                    loggger(log);
                    console.log(prefix() + "Revoking process id...")
                    var tmp = JSON.parse(JSON.stringify(id));
                    id.revoke();
                    prefix = function () {
                        return "[Readyserver] [" + tmp.id + "] ";
                    }
                    console.log(prefix() + "Revoked process id.");
                    tmp = null;
                    return;
                }
                else {
                    console.log(prefix() + "Index page is not cached. Processing request...");
                }
            }
            console.log(prefix() + "Checking if requested url exists in server folder...");
            if (easynodes.files.exists.sync(serverPath + request.url.slice(1))) {
                console.log(prefix() + "Requested url exists in server folder. Checking requested url type...");
                if (easynodes.files.getTypeOf.sync(serverPath + request.url.slice(1)) === "Folder"){
                    //We'll code this later
                    //Actually we'll code this now github copilot :)
                    //I'm not sure if it'll work but we'll see
                    //It'll work trust me
                    //It'll work

                    //Check if there is a file called index.html in the folder if yes serve it
                    //If not serve a list of files and folders in the folder

                    //Check if there is a file called index.html in the folder
                    console.log(prefix() + "Requested url type is \"Folder\". Checking if there is a file called \"index.html\" in the folder...");
                    if (easynodes.files.exists.sync(serverPath + request.url.slice(1) + "/index.html")){
                        console.log(prefix() + "There is a file called \"index.html\" in the folder. Reading it...");
                        var response = {
                            "response": null,
                            "length": null
                        }
                        try {
                            response.response = easynodes.files.read.sync(serverPath + request.url.slice(1) + "/index.html");
                        }
                        catch (error) {
                            console.error(prefix() + "An error has occured while trying to read requested file...");
                            response.response = JSON.stringify({
                                "exit_code": 1,
                                "message": "500 - An error has occured while trying to read requested file."
                            }, null, 4);
                            response.length = response.response.length;
                            log.response = response;
                            log.ContentType = "text/plain";
                            log.HttpCode = 500;
                            console.log(prefix() + "Generated response.");
                            console.log(prefix() + "Sending response with HttpCode 500...");
                            request.end(response.response, 500, { "Content-Type": "text/plain", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                            console.log(prefix() + "Sent response.");
                            console.log(prefix() + "Request finished, writing log...");
                            loggger(log);
                            console.log(prefix() + "Revoking process id...")
                            var tmp = JSON.parse(JSON.stringify(id));
                            id.revoke();
                            prefix = function () {
                                return "[Readyserver] [" + tmp.id + "] ";
                            }
                            console.log(prefix() + "Revoked process id.");
                            tmp = null;
                            return;
                        }
                        log.ContentType = "text/html";
                        log.HttpCode = 200;
                        response.length = response.response.length;
                        log.response = response;
                        console.log(prefix() + "Read requested file. Sending response...");
                        request.end(response.response, 200, { "Content-Type": log.ContentType, "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                        console.log(prefix() + "Sent response.");
                        console.log(prefix() + "Request finished, writing log...");
                        loggger(log);
                        console.log(prefix() + "Revoking process id...")
                        var tmp = JSON.parse(JSON.stringify(id));
                        id.revoke();
                        prefix = function () {
                            return "[Readyserver] [" + tmp.id + "] ";
                        }
                        console.log(prefix() + "Revoked process id.");
                        tmp = null;
                        return;
                    }
                    else{
                        console.log(prefix() + "There is no file called \"index.html\" in the folder. Generating response (Directory read)...");
                        var response = {
                            "response": null,
                            "length": null
                        }
                        console.log(prefix() + "Reading folder...");
                        var folder;
                        try{
                            //I forgor to implement reading dirs in easynodes so we'll have to use the good old fs
                            folder = require("fs").readdirSync(serverPath + request.url.slice(1));
                        }
                        catch (error){
                            console.error(prefix() + "An error has occured while trying to read requested folder...");
                            response.response = JSON.stringify({
                                "exit_code": 1,
                                "message": "500 - An error has occured while trying to read requested folder."
                            }, null, 4);
                            response.length = response.response.length;
                            log.response = response;
                            log.ContentType = "text/plain";
                            log.HttpCode = 500;
                            console.log(prefix() + "Generated response.");
                            console.log(prefix() + "Sending response with HttpCode 500...");
                            request.end(response.response, 500, { "Content-Type": "text/plain", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                            console.log(prefix() + "Sent response.");
                            console.log(prefix() + "Request finished, writing log...");
                            loggger(log);
                            console.log(prefix() + "Revoking process id...")
                            var tmp = JSON.parse(JSON.stringify(id));
                            id.revoke();
                            prefix = function () {
                                return "[Readyserver] [" + tmp.id + "] ";
                            }
                            console.log(prefix() + "Revoked process id.");
                            tmp = null;
                            return;
                        }
                        console.log(prefix() + "Read folder. Generating response...");
                        var elementlist = [];
                        var index = 0;
                        while (index < folder.length){
                            var element = folder[index];
                            var type = easynodes.files.getTypeOf.sync(serverPath + request.url.slice(1) + "/" + element);
                            if (type === "Folder"){
                                elementlist.push({
                                    "name": element,
                                    "type": "Folder"
                                });
                            }
                            else{
                                if (type === "File"){
                                    elementlist.push({
                                        "name": element,
                                        "type": "File"
                                    });
                                }
                                else{
                                    console.error(prefix() + "Corrupted.");
                                    process.exit(1);
                                }
                            }
                            index += 1;
                        }
                        response.response = `
                        <DOCTYPE html>
                        <html>
                            <head>
                                <title>Directory read</title>
                            </head>
                            <body>
                                <div id="content">
                                    <div id="textbox">
                                        <h1 id="text">Directory read</h1>
                                        <div id="list"></div>
                                    </div>
                                </div>
                            </body>
                        </html>
                        <script>
                            document.body.style.margin = "0px";
                            document.body.style.backgroundColor = "rgb(21, 21, 20)";

                            var content = document.getElementById("content");
                            content.style.height = window.innerHeight + "px";
                            content.style.width = window.innerWidth + "px";

                            var textbox = document.getElementById("textbox");
                            textbox.style.backgroundColor = "rgb(31, 31, 30)";
                            textbox.style.height = "fit-content";
                            textbox.style.width = "fit-content";
                            textbox.style.textAlign = "center";

                            var text = document.getElementById("text");
                            text.style.color = "rgb(255, 255, 255)";
                            text.style.fontFamily = "Arial";
                            
                            var list = document.getElementById("list");
                            list.style.color = "rgb(255, 255, 255)";
                            list.style.fontFamily = "Arial";
                            list.style.border = "0px"
                            list.style.height = "fit-content";
                            list.style.width = "fit-content";

                            var index = ${elementlist.length - 1};
                            while (index >= 0){
                                var element = ${JSON.stringify(elementlist)}[index];
                                var elementtext = document.createElement("font");
                                elementtext.innerHTML = element.name;
                                elementtext.style.color = "rgb(80, 255, 80)";
                                elementtext.style.fontFamily = "Arial";
                                elementtext.style.backgroundColor = "rgb(31, 31, 30)";
                                elementtext.style.textDecoration = "underline";
                                elementtext.classList.add("element");
                                (function(){
                                    var currentstyle = elementtext
                                    currentstyle.onmouseover = function(){
                                        currentstyle.style.color = "rgb(255, 80, 80)";
                                        currentstyle.style.cursor = "pointer";
                                    }
                                    currentstyle.onmouseout = function(){
                                        currentstyle.style.color = "rgb(80, 255, 80)";
                                    }
                                    currentstyle.onclick = function(){
                                        var tolink = window.location.href
                                        if (tolink.endsWith("/")){
                                            tolink = tolink.slice(0, tolink.length - 1);
                                        }
                                        tolink = tolink + "/" + currentstyle.innerHTML;
                                        window.location.href = tolink;
                                    }
                                })();
                                list.appendChild(elementtext);
                                index -= 1;
                            }

                            var style = function(){
                                content.style.height = window.innerHeight + "px";
                                content.style.width = window.innerWidth + "px";

                                var sizeref;
                                if (window.innerHeight > window.innerWidth){
                                    sizeref = window.innerHeight;
                                }
                                else{
                                    sizeref = window.innerWidth;
                                }

                                var elements = document.getElementsByClassName("element");
                                var index = 0;
                                while (index < elements.length){
                                    var element = elements[index];
                                    element.style.fontSize = (sizeref / 50) + "px";
                                    element.style.border = ((sizeref / 400) + "px")
                                    if (!(index === 0)){
                                        element.style.marginLeft = ((sizeref / 100) + "px");
                                    }
                                    index += 1;
                                }

                                textbox.style.paddingLeft = ((sizeref / 100) + "px");
                                textbox.style.paddingRight = ((sizeref / 100) + "px");
                                textbox.style.paddingBottom = ((sizeref / 100) + "px");
                                textbox.style.borderRadius = ((sizeref / 100) + "px");

                                textbox.style.marginTop = ((window.innerHeight / 2) - (textbox.offsetHeight / 2)) + "px";
                                textbox.style.marginLeft = ((window.innerWidth / 2) - (textbox.offsetWidth / 2)) + "px";
                            }
                            document.body.style.overflow = "hidden";
                            window.scrollTo(0, 0);
                            document.body.scrollTop = 0;
                            document.body.style.scrollTop = 0;
                            content.style.scrollTop = 0;
                            content.scrollTop = 0;
                            style()
                            window.scrollTo(0, 0);
                            document.body.scrollTop = 0;
                            document.body.style.scrollTop = 0;
                            content.style.scrollTop = 0;
                            content.scrollTop = 0;
                            style();
                            style()

                            var oldHeight = window.innerHeight;
                            var oldWidth = window.innerWidth;

                            setInterval(function(){
                                if (!(oldHeight === window.innerHeight && oldWidth === window.innerWidth)){
                                    style();
                                    window.scrollTo(0, 0);
                                    document.body.scrollTop = 0;
                                    document.body.style.scrollTop = 0;
                                    content.style.scrollTop = 0;
                                    content.scrollTop = 0;
                                    style()
                                    style()
                                    oldHeight = window.innerHeight;
                                    oldWidth = window.innerWidth;
                                }
                            }, 25)
                        </script>
                        `
                        response.length = response.response.length;
                        log.response = response;
                        log.ContentType = "text/html";
                        log.HttpCode = 200;
                        console.log(prefix() + "Generated response.");
                        console.log(prefix() + "Sending response with HttpCode 200...");
                        request.end(response.response, 200, { "Content-Type": "text/html", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                        console.log(prefix() + "Sent response.");
                        console.log(prefix() + "Request finished, writing log...");
                        loggger(log);
                        console.log(prefix() + "Revoking process id...")
                        var tmp = JSON.parse(JSON.stringify(id));
                        id.revoke();
                        prefix = function () {
                            return "[Readyserver] [" + tmp.id + "] ";
                        }
                        console.log(prefix() + "Revoked process id.");
                        tmp = null;
                        return;
                    }
                }
                console.log(prefix() + "Requested url type is \"File\". Reading requested file...")
                var response = {
                    "response": null,
                    "length": null
                }
                try {
                    response.response = easynodes.files.read.sync(serverPath + request.url.slice(1));
                }
                catch (error) {
                    console.error(prefix() + "An error has occured while trying to read requested file...");
                    response.response = JSON.stringify({
                        "exit_code": 1,
                        "message": "500 - An error has occured while trying to read requested file."
                    }, null, 4);
                    response.length = response.response.length;
                    log.response = response;
                    log.ContentType = "text/plain";
                    log.HttpCode = 500;
                    console.log(prefix() + "Generated response.");
                    console.log(prefix() + "Sending response with HttpCode 500...");
                    request.end(response.response, 500, { "Content-Type": "text/plain", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                    console.log(prefix() + "Sent response.");
                    console.log(prefix() + "Request finished, writing log...");
                    loggger(log);
                    console.log(prefix() + "Revoking process id...")
                    var tmp = JSON.parse(JSON.stringify(id));
                    id.revoke();
                    prefix = function () {
                        return "[Readyserver] [" + tmp.id + "] ";
                    }
                    console.log(prefix() + "Revoked process id.");
                    tmp = null;
                    return;
                }
                

                //File type detect
                //

                if (log.url.endsWith(".html")) {
                    log.ContentType = "text/html";
                    response.response = `${response.response}`;
                }
                else {
                    if (log.url.endsWith(".css")) {
                        log.ContentType = "text/css";
                        response.response = `${response.response}`;
                    }
                    else {
                        if (log.url.endsWith(".js")) {
                            log.ContentType = "application/javascript";
                            response.response = `${response.response}`;
                        }
                        else {
                            if (log.url.endsWith(".png")) {
                                log.ContentType = "image/png";
                            }
                            else {
                                if (log.url.endsWith(".jpg")) {
                                    log.ContentType = "image/jpeg";
                                }
                                else {
                                    if (log.url.endsWith(".jpeg")) {
                                        log.ContentType = "image/jpeg";
                                    }
                                    else {
                                        if (log.url.endsWith(".gif")) {
                                            log.ContentType = "image/gif";
                                        }
                                        else {
                                            if (log.url.endsWith(".ico")) {
                                                log.ContentType = "image/x-icon";
                                            }
                                            else {
                                                if (log.url.endsWith(".txt")) {
                                                    log.ContentType = "text/plain";
                                                    response.response = `${response.response}`;
                                                }
                                                else {
                                                    if (log.url.endsWith(".json")) {
                                                        log.ContentType = "application/json";
                                                        response.response = `${response.response}`;
                                                    }
                                                    else {
                                                        if (log.url.endsWith(".pdf")) {
                                                            log.ContentType = "application/pdf";
                                                        }
                                                        else {
                                                            if (log.url.endsWith(".svg")) {
                                                                log.ContentType = "image/svg+xml";
                                                                response.response = `${response.response}`;
                                                            }
                                                            else {
                                                                if (log.url.endsWith(".mp3")) {
                                                                    log.ContentType = "audio/mpeg";
                                                                }
                                                                else {
                                                                    if (log.url.endsWith(".mp4")) {
                                                                        log.ContentType = "video/mp4";
                                                                    }
                                                                    else {
                                                                        if (log.url.endsWith(".wav")) {
                                                                            log.ContentType = "audio/wav";
                                                                        }
                                                                        else {
                                                                            if (log.url.endsWith(".zip")) {
                                                                                log.ContentType = "application/zip";
                                                                            }
                                                                            else {
                                                                                if (log.url.endsWith(".xls")) {
                                                                                    log.ContentType = "application/vnd.ms-excel";
                                                                                }
                                                                                else {
                                                                                    if (log.url.endsWith(".ppt")) {
                                                                                        log.ContentType = "application/vnd.ms-powerpoint";
                                                                                    }
                                                                                    else {
                                                                                        if (log.url.endsWith(".doc")) {
                                                                                            log.ContentType = "application/msword";
                                                                                        }
                                                                                        else {
                                                                                            if (log.url.endsWith(".xml")) {
                                                                                                log.ContentType = "application/xml";
                                                                                            }
                                                                                            else {
                                                                                                if (log.url.endsWith(".gz")) {
                                                                                                    log.ContentType = "application/gzip";
                                                                                                }
                                                                                                else {
                                                                                                    if (log.url.endsWith(".tar")) {
                                                                                                        log.ContentType = "application/x-tar";
                                                                                                    }
                                                                                                    else {
                                                                                                        if (log.url.endsWith(".ogg")) {
                                                                                                            log.ContentType = "audio/ogg";
                                                                                                        }
                                                                                                        else {
                                                                                                            if (log.url.endsWith(".webm")) {
                                                                                                                log.ContentType = "video/webm";
                                                                                                            }
                                                                                                            else {
                                                                                                                if (log.url.endsWith(".csv")) {
                                                                                                                    log.ContentType = "text/csv";
                                                                                                                }
                                                                                                                else {
                                                                                                                    if (log.url.endsWith(".pptx")) {
                                                                                                                        log.ContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        if (log.url.endsWith(".xlsx")) {
                                                                                                                            log.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            if (log.url.endsWith(".docx")) {
                                                                                                                                log.ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                if (log.url.endsWith(".odt")) {
                                                                                                                                    log.ContentType = "application/vnd.oasis.opendocument.text";
                                                                                                                                }
                                                                                                                                else {
                                                                                                                                    if (log.url.endsWith(".ods")) {
                                                                                                                                        log.ContentType = "application/vnd.oasis.opendocument.spreadsheet";
                                                                                                                                    }
                                                                                                                                    else {
                                                                                                                                        if (log.url.endsWith(".odp")) {
                                                                                                                                            log.ContentType = "application/vnd.oasis.opendocument.presentation";
                                                                                                                                        }
                                                                                                                                        else {
                                                                                                                                            if (log.url.endsWith(".csv")) {
                                                                                                                                                log.ContentType = "text/csv";
                                                                                                                                            }
                                                                                                                                            else{
                                                                                                                                                log.ContentType = "application/octet-stream";
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                //File type detect end
                //

                log.HttpCode = 200;
                response.length = response.response.length;
                log.response = response;
                console.log(prefix() + "Read requested file. Sending response...");
                request.end(response.response, 200, { "Content-Type": log.ContentType, "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                console.log(prefix() + "Sent response.");
                console.log(prefix() + "Request finished, writing log...");
                loggger(log);
                console.log(prefix() + "Revoking process id...")
                var tmp = JSON.parse(JSON.stringify(id));
                id.revoke();
                prefix = function () {
                    return "[Readyserver] [" + tmp.id + "] ";
                }
                console.log(prefix() + "Revoked process id.");
                tmp = null;
                return;
            }
            else{
                //404
                console.log(prefix() + "Requested url doesn't exist in server folder. Checking if custom 404 page exists...");
                if (cache.pages.custom_404 == null) {
                    console.log(prefix() + "Custom 404 page doesn't exist. Generating response...");
                    var response = {
                        "response": `
                        <DOCTYPE html>
                        <html>
                            <head>
                                <title>404 - Not Found</title>
                            </head>
                            <body>
                                <div id="content">
                                    <div id="textbox">
                                        <h1 id="text">404 - Not Found</h1>
                                        <a href="/"><button id="home">Home</button></a>
                                    </div>
                                </div>
                            </body>
                        </html>
                        <script>
                            //Readyserver code by willmil11
                            //404 default page
                            //

                            var content = document.getElementById("content");
                            var textbox = document.getElementById("textbox");
                            var text = document.getElementById("text");
                            var home = document.getElementById("home");

                            document.body.style.margin = "0px"
                            document.body.style.backgroundColor = "rgb(21, 21, 20)";
                            content.style.height = window.innerHeight + "px";
                            content.style.width = window.innerWidth + "px";
                            content.style.backgroundColor = "rgb(21, 21, 20)";
                            textbox.style.backgroundColor = "rgb(31, 31, 30)";
                            textbox.style.height = "fit-content";
                            textbox.style.width = "fit-content";
                            textbox.style.textAlign = "center";

                            text.style.color = "rgb(255, 255, 255)";
                            text.style.fontFamily = "Arial";
                            
                            home.style.color = "rgb(255, 255, 255)";
                            home.style.fontFamily = "Arial";
                            home.style.border = "0px"
                            home.style.backgroundColor = "rgb(21, 21, 20)";
                            home.onmouseover = function(){
                                home.style.backgroundColor = "rgb(255, 80, 80)";
                            }
                            home.onmouseout = function(){
                                home.style.backgroundColor = "rgb(21, 21, 20)";
                            }
                            home.onclick = function(){
                                window.location.href = "/";
                            }

                            var style = function(){
                                var sizeref;
                                if (window.innerHeight > window.innerWidth){
                                    sizeref = window.innerHeight;
                                }
                                else{
                                    sizeref = window.innerWidth;
                                }

                                text.style.width = "fit-content";
                                text.style.height = "fit-content";
                                text.style.fontSize = ((sizeref / 25) + "px");
                                home.style.fontSize = ((sizeref / 30) + "px");

                                home.style.border = ((sizeref / 400) + "px solid rgb(255, 255, 255)");
                                home.style.borderRadius = ((sizeref / 100) + "px");

                                textbox.style.paddingLeft = ((sizeref / 100) + "px");
                                textbox.style.paddingRight = ((sizeref / 100) + "px");
                                textbox.style.paddingBottom = ((sizeref / 100) + "px");
                                textbox.style.borderRadius = ((sizeref / 100) + "px");

                                textbox.style.marginLeft = ((window.innerWidth / 2) - (textbox.offsetWidth / 2)) + "px";
                                textbox.style.marginTop = ((window.innerHeight / 2) - (textbox.offsetHeight / 2)) + "px";

                                //Scroll to top
                                window.scrollTo(0, 0);
                                content.scrollTop = 0;
                                document.body.scrollTop = 0;
                            }
                            style();

                            var oldWidth = window.innerWidth;
                            var oldHeight = window.innerHeight;

                            setInterval(function(){
                                if (!(oldWidth === window.innerWidth) || !(oldHeight === window.innerHeight)){
                                    style();
                                    oldWidth = window.innerWidth;
                                    oldHeight = window.innerHeight;
                                }
                            }, 25);

                            document.body.style.overflow = "hidden";

                            style();
                        </script>
                        `,
                        "length": null
                    }
                    response.length = response.response.length;
                    log.response = response;
                    log.ContentType = "text/html";
                    log.HttpCode = 404;
                    console.log(prefix() + "Generated response.");
                    console.log(prefix() + "Sending response with HttpCode 404...");
                    request.end(response.response, 404, { "Content-Type": "text/html", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                    console.log(prefix() + "Sent response.");
                    console.log(prefix() + "Request finished, writing log...");
                    loggger(log);
                    console.log(prefix() + "Revoking process id...")
                    var tmp = JSON.parse(JSON.stringify(id));
                    id.revoke();
                    prefix = function () {
                        return "[Readyserver] [" + tmp.id + "] ";
                    }
                    console.log(prefix() + "Revoked process id.");
                    tmp = null;
                    return;
                }
                else{
                    console.log(prefix() + "Custom 404 page exists. Generating response...");
                    var response = {
                        "response": cache.pages.custom_404,
                        "length": cache.pages.custom_404.length
                    }
                    log.response = response;
                    log.ContentType = "text/html";
                    log.HttpCode = 404;
                    console.log(prefix() + "Generated response.");
                    console.log(prefix() + "Sending response with HttpCode 404...");
                    request.end(response.response, 404, { "Content-Type": "text/html", "Content-Length": response.length, "Access-Control-Allow-Origin": "*" });
                    console.log(prefix() + "Sent response.");
                    console.log(prefix() + "Request finished, writing log...");
                    loggger(log);
                    console.log(prefix() + "Revoking process id...")
                    var tmp = JSON.parse(JSON.stringify(id));
                    id.revoke();
                    prefix = function () {
                        return "[Readyserver] [" + tmp.id + "] ";
                    }
                    console.log(prefix() + "Revoked process id.");
                    tmp = null;
                    return;
                }
            }
        }
    }, port);
}
app();