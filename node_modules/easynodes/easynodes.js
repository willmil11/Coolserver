//Easynodes module by willmil11
//

module.exports = {
    "system": {
        "genprefix": function () {
            return module.exports.system.prefix + " ";
        },
        "verboselog": function (message) {
            if (module.exports.system.verbose) {
                console.log(module.exports.system.genprefix() + message);
            }
        },
        "modules": {},
        "inited": false,
        "checkinit": function () {
            if (!(module.exports.system.inited)) {
                throw "[Easynodes] Easynodes not initialized, please run init() before using any other functions";
            }
        }
    },
    "init": function (verbose, prefix) {
        if (verbose == null) {
            verbose = false;
        }
        else {
            if ((verbose != true) && (verbose != false)) {
                throw "[Easynodes] Invalid verbose value, must be true, false or unspecified"
            }
        }
        module.exports.system.verbose = verbose;
        if (prefix == null) {
            prefix = "[Easynodes]";
            module.exports.system.prefix = prefix;
        }
        else {
            if (!(typeof prefix == "string")) {
                throw "[Easynodes] Invalid prefix value, must be a string or unspecified"
            }
            else {
                module.exports.system.prefix = prefix;
            }
        }
        try {
            module.exports.system.modules.http = require("http");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading http module."
        }
        try {
            module.exports.system.modules.fs = require("fs-extra");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading fs module."
        }
        try {
            module.exports.system.modules.url = require("url");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading url module."
        }
        try {
            module.exports.system.modules.path = require("path");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading path module."
        }
        try {
            module.exports.system.modules.https = require("https");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading https module."
        }
        try {
            module.exports.system.modules.child_process = require("child_process");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading child_process module."
        }
        try {
            module.exports.system.modules.os = require("os");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading os module."
        }
        try {
            module.exports.system.modules.websocket = require("ws");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading websocket module."
        }
        try {
            module.exports.system.modules.line_current = require("line-current");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading line-current module."
        }
        try {
            module.exports.system.modules.dataquest = require("dataquest");
        }
        catch (error) {
            throw module.exports.system.prefix + " Error loading dataquest module."
        }
        module.exports.dataquest = module.exports.system.modules.dataquest;
        module.exports.line_current = module.exports.system.modules.line_current;
        module.exports.system.verboselog("Easynodes ready...");
        module.exports.system.inited = true;
    },
    "logging": {
        "changeprefix": function (prefix) {
            module.exports.system.checkinit();
            if (!(typeof prefix == "string")) {
                throw "[Easynodes] Invalid prefix value, must be a string"
            }
            else {
                module.exports.system.prefix = prefix;
            }
        },
        "enableverbose": function () {
            module.exports.system.checkinit();
            if (module.exports.system.verbose == true) {
                //Warn user
                module.exports.system.verboselog("Warning: Verbose is already enabled");
                return module.exports.system.prefix + " Verbose is already enabled";
            }
            module.exports.system.verbose = true;
        },
        "disableverbose": function () {
            module.exports.system.checkinit();
            if (module.exports.system.verbose == false) {
                //Warn user
                module.exports.system.verboselog("Warning: Verbose is already disabled");
                return module.exports.system.prefix + " Verbose is already disabled";
            }
            module.exports.system.verbose = false;
        }
    },
    "http": {
        "get": {
            "sync": async function (url) {
                module.exports.system.checkinit();
                if (!(typeof url == "string")) {
                    throw module.exports.system.prefix + " Invalid url value, must be a string"
                }
                else {
                    if (url == null) {
                        throw module.exports.system.prefix + " Invalid url value, must be a string"
                    }
                    else {
                        if (url === "") {
                            throw module.exports.system.prefix + " Invalid url value, must be a string"
                        }
                        else {
                            var onlyspaces = true;
                            var index = 0;

                            while (index < url.length) {
                                if (url.slice(index, index + 1) != " ") {
                                    onlyspaces = false;
                                    break;
                                }
                                index += 1;
                            }
                            if (onlyspaces) {
                                throw module.exports.system.prefix + " Invalid url value, must be a string"
                            }
                        }
                    }
                }
                var result = "";
                var ended = false;

                try {
                    module.exports.system.modules.http.get(url, function (response) {
                        response.on("data", function (chunk) {
                            result += chunk;
                        });
                        response.on("end", function () {
                            ended = true;
                        });
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting data synchronously from \"" + url + "\" using http";
                }

                while (!(ended)) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                }

                return result;
            },
            "async": function (url, callback) {
                module.exports.system.checkinit();
                if (!(typeof url == "string")) {
                    throw module.exports.system.prefix + " Invalid url value, must be a string"
                }
                else {
                    if (url == null) {
                        throw module.exports.system.prefix + " Invalid url value, must be a string"
                    }
                    else {
                        if (url === "") {
                            throw module.exports.system.prefix + " Invalid url value, must be a string"
                        }
                        else {
                            var onlyspaces = true;
                            var index = 0;

                            while (index < url.length) {
                                if (url.slice(index, index + 1) != " ") {
                                    onlyspaces = false;
                                    break;
                                }
                                index += 1;
                            }
                            if (onlyspaces) {
                                throw module.exports.system.prefix + " Invalid url value, must be a string"
                            }
                        }
                    }
                }
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.http.get(url, function (response) {
                        callback({
                            "on": function (event, eventcallback) {
                                if (event === "data") {
                                    if (!(typeof eventcallback == "function")) {
                                        throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                    }
                                    else {
                                        if (eventcallback == null) {
                                            throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                        }
                                    }
                                    response.on("data", function (chunk) {
                                        eventcallback(chunk);
                                    });
                                }
                                else {
                                    if (event === "end") {
                                        if (!(typeof eventcallback == "function")) {
                                            throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                        }
                                        else {
                                            if (eventcallback == null) {
                                                throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                            }
                                        }
                                        response.on("end", function () {
                                            eventcallback();
                                        });
                                    }
                                    else {
                                        throw module.exports.system.prefix + " Invalid event value, must be \"data\" or \"end\""
                                    }
                                }
                            },
                            "abort": function () {
                                response.destroy();
                            },
                            "statusCode": response.statusCode,
                            "removeEvents": function () {
                                response.removeAllListeners();
                            }
                        });
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting data asynchronously from \"" + url + "\" using http";
                }
            }
        },
        "newServer": function (callback, port, ip) {
            module.exports.system.checkinit();

            if (!(typeof port == "number")) {
                throw module.exports.system.prefix + " Invalid port value, must be a number"
            }
            else {
                if (port == null) {
                    throw module.exports.system.prefix + " Invalid port value, must be a number"
                }
                else {
                    if (port < 0) {
                        throw module.exports.system.prefix + " Invalid port value, must be a number"
                    }
                }
            }

            if (!(typeof callback == "function")) {
                throw module.exports.system.prefix + " Invalid callback value, must be a function"
            }
            else {
                if (callback == null) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
            }

            if (ip == null) { }
            else {
                if (!(typeof ip == "string")) {
                    throw module.exports.system.prefix + " Invalid ip value, must be a string"
                }
                else {
                    if (ip === "") {
                        throw module.exports.system.prefix + " Invalid ip value, must be a string"
                    }
                    else {
                        var onlyspaces = true;
                        var index = 0;

                        while (index < ip.length) {
                            if (ip.slice(index, index + 1) != " ") {
                                onlyspaces = false;
                                break;
                            }
                            index += 1;
                        }
                        if (onlyspaces) {
                            throw module.exports.system.prefix + " Invalid ip value, must be a string"
                        }
                    }
                }
            }

            try {
                if (ip == null) {
                    module.exports.system.modules.http.createServer(function (req, res) {
                        var system = {
                            "set": {
                                "writeHead": false,
                                "httpCode": false
                            }
                        }
                        callback({
                            "ip": req.connection.remoteAddress.slice(7),
                            "url": req.url,
                            "method": req.method,
                            "headers": req.headers,
                            "write": function (data, httpCode, writeHead) {
                                if (writeHead == null) {
                                    if (httpCode == null) {
                                        res.write(data);
                                    }
                                    else {
                                        if (!(typeof httpCode == "number")) {
                                            throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                        }
                                        if (system.set.httpCode === false) {
                                            res.writeHead(httpCode);
                                            system.set.httpCode = true;
                                        }
                                        else {
                                            module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                        }
                                        res.write(data);
                                    }
                                }
                                else {
                                    if (!(typeof writeHead == "object")) {
                                        throw module.exports.system.prefix + " Invalid writeHead value, must be an object"
                                    }
                                    else {
                                        if (writeHead == null) {
                                            if (httpCode == null) {
                                                res.write(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.httpCode === false) {
                                                    res.writeHead(httpCode);
                                                    system.set.httpCode = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                        }
                                        else {
                                            if (httpCode == null) {
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(200, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(httpCode, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                        }
                                    }
                                }
                            },
                            "end": function (data, httpCode, writeHead) {
                                if (data == null) {
                                    res.end();
                                    return;
                                }
                                if (writeHead == null) {
                                    if (httpCode == null) {
                                        res.end(data);
                                    }
                                    else {
                                        if (!(typeof httpCode == "number")) {
                                            throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                        }
                                        if (system.set.httpCode === false) {
                                            res.writeHead(httpCode);
                                            system.set.httpCode = true;
                                        }
                                        else {
                                            module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                        }
                                        res.end(data);
                                    }
                                }
                                else {
                                    if (!(typeof writeHead == "object")) {
                                        throw module.exports.system.prefix + " Invalid writeHead value, must be an object"
                                    }
                                    else {
                                        if (writeHead == null) {
                                            if (httpCode == null) {
                                                res.end(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.httpCode === false) {
                                                    res.writeHead(httpCode);
                                                    system.set.httpCode = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                        }
                                        else {
                                            if (httpCode == null) {
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(200, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(httpCode, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }).listen(port);
                }
                else {
                    module.exports.system.modules.http.createServer(function (req, res) {
                        var system = {
                            "set": {
                                "writeHead": false,
                                "httpCode": false
                            }
                        }
                        callback({
                            "ip": req.connection.remoteAddress.slice(7),
                            "url": req.url,
                            "method": req.method,
                            "headers": req.headers,
                            "write": function (data, httpCode, writeHead) {
                                if (writeHead == null) {
                                    if (httpCode == null) {
                                        res.write(data);
                                    }
                                    else {
                                        if (!(typeof httpCode == "number")) {
                                            throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                        }
                                        if (system.set.httpCode === false) {
                                            res.writeHead(httpCode);
                                            system.set.httpCode = true;
                                        }
                                        else {
                                            module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                        }
                                        res.write(data);
                                    }
                                }
                                else {
                                    if (!(typeof writeHead == "object")) {
                                        throw module.exports.system.prefix + " Invalid writeHead value, must be an object"
                                    }
                                    else {
                                        if (writeHead == null) {
                                            if (httpCode == null) {
                                                res.write(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.httpCode === false) {
                                                    res.writeHead(httpCode);
                                                    system.set.httpCode = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                        }
                                        else {
                                            if (httpCode == null) {
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(200, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(httpCode, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.write(data);
                                            }
                                        }
                                    }
                                }
                            },
                            "end": function (data, httpCode, writeHead) {
                                if (data == null) {
                                    res.end();
                                    return;
                                }
                                if (writeHead == null) {
                                    if (httpCode == null) {
                                        res.end(data);
                                    }
                                    else {
                                        if (!(typeof httpCode == "number")) {
                                            throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                        }
                                        if (system.set.httpCode === false) {
                                            res.writeHead(httpCode);
                                            system.set.httpCode = true;
                                        }
                                        else {
                                            module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                        }
                                        res.end(data);
                                    }
                                }
                                else {
                                    if (!(typeof writeHead == "object")) {
                                        throw module.exports.system.prefix + " Invalid writeHead value, must be an object"
                                    }
                                    else {
                                        if (writeHead == null) {
                                            if (httpCode == null) {
                                                res.end(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.httpCode === false) {
                                                    res.writeHead(httpCode);
                                                    system.set.httpCode = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                        }
                                        else {
                                            if (httpCode == null) {
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(200, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                            else {
                                                if (!(typeof httpCode == "number")) {
                                                    throw module.exports.system.prefix + " Invalid httpCode value, must be a number"
                                                }
                                                if (system.set.writeHead === false) {
                                                    res.writeHead(httpCode, writeHead);
                                                    system.set.writeHead = true;
                                                }
                                                else {
                                                    module.exports.system.verboselog("Warning: writeHead already set, ignoring writeHead value");
                                                    system.set.httpCode = true;
                                                    module.exports.system.verboselog("Warning: httpCode already set, ignoring httpCode value");
                                                }
                                                res.end(data);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }).listen(port, ip);
                }
            }
            catch (error) {
                if (ip == null) {
                    throw module.exports.system.prefix + " Error creating http server on port \"" + port + "\"";
                }
                else {
                    throw module.exports.system.prefix + " Error creating http server on port \"" + port + "\" and ip \"" + ip + "\"";
                }
            }
        }
    },
    "websocket": {
        "newClient": function (adress, callback) {
            if (!(typeof adress == "string")) {
                throw module.exports.system.prefix + " Invalid adress value, must be a string"
            }
            else {
                if (adress == null) {
                    throw module.exports.system.prefix + " Invalid adress value, must be a string"
                }
                else {
                    if (adress === "") {
                        throw module.exports.system.prefix + " Invalid adress value, must be a string"
                    }
                    else {
                        var onlyspaces = true;
                        var index = 0;

                        while (index < adress.length) {
                            if (adress.slice(index, index + 1) != " ") {
                                onlyspaces = false;
                                break;
                            }
                            index += 1;
                        }
                        if (onlyspaces) {
                            throw module.exports.system.prefix + " Invalid adress value, must be a string"
                        }
                    }
                }
            }
            if (!(typeof callback == "function")) {
                throw module.exports.system.prefix + " Invalid callback value, must be a function"
            }
            else {
                if (callback == null) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
            }
            try {
                var client = new module.exports.system.modules.websocket(adress);
                client.on("open", function () {
                    callback({
                        "send": function (data) {
                            client.send(data);
                        },
                        "close": function () {
                            client.close();
                        },
                        "removeEvents": function () {
                            client.removeAllListeners();
                        },
                        "onmessage": function (eventcallback) {
                            if (!(typeof eventcallback == "function")) {
                                throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                            }
                            else {
                                if (eventcallback == null) {
                                    throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                }
                            }
                            client.on("message", function (message) {
                                eventcallback(`${message}`);
                            });
                        },
                        "onclose": function (eventcallback) {
                            if (!(typeof eventcallback == "function")) {
                                throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                            }
                            else {
                                if (eventcallback == null) {
                                    throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                }
                            }
                            client.on("close", function () {
                                eventcallback();
                            });
                        }
                    });
                });
            }
            catch (error) {
                throw module.exports.system.prefix + " Error creating websocket client on adress \"" + adress + "\"";
            }
        },
        "newServer": function (port, callback) {
            if (!(typeof port == "number")) {
                throw module.exports.system.prefix + " Invalid port value, must be a number"
            }
            else {
                if (port == null) {
                    throw module.exports.system.prefix + " Invalid port value, must be a number"
                }
                else {
                    if (port < 0) {
                        throw module.exports.system.prefix + " Invalid port value, must be a number"
                    }
                }
            }
            if (!(typeof callback == "function")) {
                throw module.exports.system.prefix + " Invalid callback value, must be a function"
            }
            else {
                if (callback == null) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
            }
            try {
                var server = new module.exports.system.modules.websocket.Server({ port: port });
                server.on("connection", function (ws) {
                    callback({
                        "send": function (data) {
                            ws.send(data);
                        },
                        "onclose": function (eventcallback) {
                            if (!(typeof eventcallback == "function")) {
                                throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                            }
                            else {
                                if (eventcallback == null) {
                                    throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                }
                            }
                            ws.on("close", function () {
                                eventcallback();
                            });
                        },
                        "removeEvents": function () {
                            ws.removeAllListeners();
                        },
                        "onmessage": function (eventcallback) {
                            if (!(typeof eventcallback == "function")) {
                                throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                            }
                            else {
                                if (eventcallback == null) {
                                    throw module.exports.system.prefix + " Invalid eventcallback value, must be a function"
                                }
                            }
                            ws.on("message", function (message) {
                                eventcallback(`${message}`);
                            });
                        },
                        "close": function () {
                            ws.close();
                        }
                    });
                })
            }
            catch (error) {
                throw module.exports.system.prefix + " Error creating websocket server on port \"" + port + "\"";
            }
        }
    },
    "dataquest": null,
    "line_current": null,
    "files": {
        "getDirname": function () {
            module.exports.system.checkinit();
            //Return current dirname
            return __dirname;
        },
        "read": {
            "sync": function (path) {
                module.exports.system.checkinit();
                var data;
                try {
                    data = module.exports.system.modules.fs.readFileSync(path);
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error reading file \"" + path + "\"";
                }
                return data;
            },
            "async": function (path, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.readFile(path, function (error, data) {
                        if (error) {
                            throw module.exports.system.prefix + " Error reading file \"" + path + "\"";
                        }
                        callback(data);
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error reading file \"" + path + "\"";
                }
            }
        },
        "write": {
            "write": {
                "sync": function (path, data) {
                    module.exports.system.checkinit();
                    try {
                        module.exports.system.modules.fs.writeFileSync(path, data);
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                    }
                },
                "async": function (path, data, callback) {
                    module.exports.system.checkinit();
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    try {
                        module.exports.system.modules.fs.writeFile(path, data, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                    }
                }
            },
            "add": {
                "sync": function (path, data) {
                    module.exports.system.checkinit();
                    try {
                        module.exports.system.modules.fs.appendFileSync(path, data);
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                    }
                },
                "async": function (path, data, callback) {
                    module.exports.system.checkinit();
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    try {
                        module.exports.system.modules.fs.appendFile(path, data, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error writing file \"" + path + "\"";
                    }
                }
            }
        },
        "delete": {
            "sync": function (path) {
                module.exports.system.checkinit();
                //Try to check if is a dir if a dir delete recursively else delete file
                var folder = false;
                try {
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                }
                //Use fs.rmSync to delete file or use fs.rmSync but recursively for dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.rmSync(path, { recursive: true });
                    }
                    else {
                        module.exports.system.modules.fs.rmSync(path);
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                }
            },
            "async": function (path, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                //Try to check if is a dir if a dir delete recursively else delete file
                var folder = false;
                try {
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                }
                //Use fs.rmSync to delete file or use fs.rmSync but recursively for dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.rm(path, { recursive: true }, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    else {
                        module.exports.system.modules.fs.rm(path, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error deleting file \"" + path + "\"";
                }
            }
        },
        "copy": {
            "sync": function (path, dest) {
                module.exports.system.checkinit();
                //Check if path is a dir or a file
                var folder = false;
                try{
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                }
                //Copy file or dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.copySync(path, dest, { recursive: true });
                    }
                    else {
                        module.exports.system.modules.fs.copySync(path, dest);
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                }
            },
            "async": function (path, dest, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                //Check if path is a dir or a file
                var folder = false;
                try {
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                }
                //Copy file or dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.copy(path, dest, { recursive: true }, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    else {
                        module.exports.system.modules.fs.copy(path, dest, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error copying file \"" + path + "\"";
                }
            }
        },
        "move": {
            "sync": function (path, dest) {
                module.exports.system.checkinit();
                try{
                    module.exports.system.modules.fs.moveSync(path, dest);
                }
                catch (error){
                    console.debug(error)
                    throw module.exports.system.prefix + " Error moving file \"" + path + "\"";
                }
            },
            "async": function (path, dest, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.move(path, dest, function (error) {
                        if (error) {
                            throw module.exports.system.prefix + " Error moving file \"" + path + "\"";
                        }
                        callback();
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error moving file \"" + path + "\"";
                }
            }
        },
        "create": {
            "folder": {
                "sync": function (path) {
                    module.exports.system.checkinit();
                    //Check if path already exists
                    if (module.exports.system.modules.fs.existsSync(path)) {
                        module.exports.system.verboselog("Warning: folder already exists, ignoring folder creation");
                        return;
                    }
                    try{
                        module.exports.system.modules.fs.mkdirSync(path);
                    }
                    catch (error) {
                        console.debug(error)
                        throw module.exports.system.prefix + " Error creating folder \"" + path + "\"";
                    }
                },
                "async": function (path, callback) {
                    module.exports.system.checkinit();
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    //Check if path already exists
                    if (module.exports.system.modules.fs.existsSync(path)) {
                        module.exports.system.verboselog("Warning: folder already exists, ignoring folder creation");
                        return;
                    }
                    try {
                        module.exports.system.modules.fs.mkdir(path, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error creating folder \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error creating folder \"" + path + "\"";
                    }
                }
            },
            "file": {
                "sync": function (path, data) {
                    module.exports.system.checkinit();
                    if (module.exports.system.modules.fs.existsSync(path)) {
                        module.exports.system.verboselog("Warning: file already exists, ignoring file creation");
                        return;
                    }
                    if (data == null){
                        data = "";
                    }
                    try {
                        module.exports.system.modules.fs.writeFileSync(path, data);
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error creating file \"" + path + "\"";
                    }
                },
                "async": function (path, data, callback) {
                    module.exports.system.checkinit();
                    if (data == null){
                        data = "";
                    }
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    //Check if path already exists
                    if (module.exports.system.modules.fs.existsSync(path)) {
                        module.exports.system.verboselog("Warning: file already exists, ignoring file creation");
                        return;
                    }
                    try {
                        module.exports.system.modules.fs.writeFile(path, data, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error creating file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error creating file \"" + path + "\"";
                    }
                }
            }
        },
        "rename": {
            "sync": function (path, dest) {
                module.exports.system.checkinit();
                //Check if path is a dir or a file
                var folder = false;
                try {
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                }
                //Rename file or dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.renameSync(path, dest);
                    }
                    else {
                        module.exports.system.modules.fs.renameSync(path, dest);
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                }
            },
            "async": function (path, dest, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                //Check if path is a dir or a file
                var folder = false;
                try {
                    if (module.exports.system.modules.fs.lstatSync(path).isDirectory()) {
                        folder = true;
                    }
                    else {
                        folder = false;
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                }
                //Rename file or dir
                try {
                    if (folder) {
                        module.exports.system.modules.fs.rename(path, dest, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                    else {
                        module.exports.system.modules.fs.rename(path, dest, function (error) {
                            if (error) {
                                throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                            }
                            callback();
                        });
                    }
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error renaming file \"" + path + "\"";
                }
            }
        },
        "exists": {
            //Use fs.exists or fs.existsSync
            "sync": function (path) {
                module.exports.system.checkinit();
                var exists;
                try {
                    exists = module.exports.system.modules.fs.existsSync(path);
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error checking if file \"" + path + "\" exists";
                }
                return exists;
            },
            "async": function (path, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.exists(path, function (exists) {
                        callback(exists);
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error checking if file \"" + path + "\" exists";
                }
            }
        },
        "getTypeOf": {
            //Use fs.lstatSync to get file type
            "sync": function (path) {
                module.exports.system.checkinit();
                var type;
                try {
                    type = module.exports.system.modules.fs.lstatSync(path).isDirectory();
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting type of file \"" + path + "\"";
                }
                if (type){
                    return "Folder";
                }
                else{
                    return "File";
                }
            },
            "async": function (path, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.lstat(path, function (error, stats) {
                        if (error) {
                            throw module.exports.system.prefix + " Error getting type of file \"" + path + "\"";
                        }
                        if (stats.isDirectory()){
                            callback("Folder");
                        }
                        else{
                            callback("File");
                        }
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting type of file \"" + path + "\"";
                }
            }
        },
        "getSize": {
            //Use fs.lstatSync to get file size as bytes then put it in the most human readable format
            "sync": function (path) {
                module.exports.system.checkinit();
                var size;
                try {
                    size = module.exports.system.modules.fs.lstatSync(path).size;
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting size of file \"" + path + "\"";
                }
                var sizeunit = "B";
                if (size > 1024) {
                    size = size / 1024;
                    sizeunit = "KB";
                    if (size > 1024) {
                        size = size / 1024;
                        sizeunit = "MB";
                        if (size > 1024) {
                            size = size / 1024;
                            sizeunit = "GB";
                            if (size > 1024) {
                                size = size / 1024;
                                sizeunit = "TB";
                            }
                        }
                    }
                }
                return size + sizeunit;
            },
            "async": function (path, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.lstat(path, function (error, stats) {
                        if (error) {
                            throw module.exports.system.prefix + " Error getting size of file \"" + path + "\"";
                        }
                        var size = stats.size;
                        var sizeunit = "B";
                        if (size > 1024) {
                            size = size / 1024;
                            sizeunit = "KB";
                            if (size > 1024) {
                                size = size / 1024;
                                sizeunit = "MB";
                                if (size > 1024) {
                                    size = size / 1024;
                                    sizeunit = "GB";
                                    if (size > 1024) {
                                        size = size / 1024;
                                        sizeunit = "TB";
                                    }
                                }
                            }
                        }
                        callback(size + sizeunit);
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error getting size of file \"" + path + "\"";
                }
            }
        },
        "getPermissions": {
            "asNumber": {
                //Number must be normal like 777 instead of 33279
                "sync": function (path) {
                    module.exports.system.checkinit();
                    var permissions;
                    try {
                        permissions = module.exports.system.modules.fs.lstatSync(path).mode;
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                    }
                    return permissions;
                },
                "async": function (path, callback) {
                    module.exports.system.checkinit();
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    try {
                        module.exports.system.modules.fs.lstat(path, function (error, stats) {
                            if (error) {
                                throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                            }
                            callback(stats.mode);
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                    }
                }
            },
            "asString": {
                //String like "r" or "rw" or "rx" or "rwx" or "w" or "wx" or "x"
                "sync": function (path) {
                    module.exports.system.checkinit();
                    var permissions;
                    try {
                        permissions = module.exports.system.modules.fs.lstatSync(path).mode;
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                    }
                    var permissionsstring = "";
                    if (permissions & 4) {
                        permissionsstring += "r";
                    }
                    else {
                        permissionsstring += "-";
                    }
                    if (permissions & 2) {
                        permissionsstring += "w";
                    }
                    else {
                        permissionsstring += "-";
                    }
                    if (permissions & 1) {
                        permissionsstring += "x";
                    }
                    else {
                        permissionsstring += "-";
                    }
                    return permissionsstring;
                },
                "async": function (path, callback) {
                    module.exports.system.checkinit();
                    if (!(typeof callback == "function")) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                    else {
                        if (callback == null) {
                            throw module.exports.system.prefix + " Invalid callback value, must be a function"
                        }
                    }
                    try {
                        module.exports.system.modules.fs.lstat(path, function (error, stats) {
                            if (error) {
                                throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                            }
                            var permissionsstring = "";
                            if (stats.mode & 4) {
                                permissionsstring += "r";
                            }
                            else {
                                permissionsstring += "-";
                            }
                            if (stats.mode & 2) {
                                permissionsstring += "w";
                            }
                            else {
                                permissionsstring += "-";
                            }
                            if (stats.mode & 1) {
                                permissionsstring += "x";
                            }
                            else {
                                permissionsstring += "-";
                            }
                            callback(permissionsstring);
                        });
                    }
                    catch (error) {
                        throw module.exports.system.prefix + " Error getting permissions of file \"" + path + "\"";
                    }
                }
            }
        },
        "setPermissions": {
            "sync": function (path, permissions) {
                module.exports.system.checkinit();
                try {
                    module.exports.system.modules.fs.chmodSync(path, permissions);
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error setting permissions of file \"" + path + "\"";
                }
            },
            "async": function (path, permissions, callback) {
                module.exports.system.checkinit();
                if (!(typeof callback == "function")) {
                    throw module.exports.system.prefix + " Invalid callback value, must be a function"
                }
                else {
                    if (callback == null) {
                        throw module.exports.system.prefix + " Invalid callback value, must be a function"
                    }
                }
                try {
                    module.exports.system.modules.fs.chmod(path, permissions, function (error) {
                        if (error) {
                            throw module.exports.system.prefix + " Error setting permissions of file \"" + path + "\"";
                        }
                        callback();
                    });
                }
                catch (error) {
                    throw module.exports.system.prefix + " Error setting permissions of file \"" + path + "\"";
                }
            }
        }
    }
}