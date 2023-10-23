//Dataquest by willmil11
//

module.exports = {
    "system": {
        "inited": false,
        "verbose": false,
        "modules": {},
        "generatethrow": function (error) {
            return "[Dataquest] " + error;
        },
        "checkinit": function () {
            if (!(module.exports.system.inited)) {
                throw module.exports.system.generatethrow("Dataquest is not initialized");
            }
        }
    },
    "init": function (verbose) {
        if (verbose == null) {
            verbose = false;
        }
        if (!(typeof verbose == "boolean")) {
            throw module.exports.system.generatethrow("Verbose must be either true, false or nothing");
        }
        module.exports.system.verbose = verbose;
        try {
            module.exports.system.modules.fs = require('fs');
        }
        catch (error) {
            throw module.exports.system.generatethrow("An error has occured while loading the fs module");
        }

        module.exports.system.inited = true;
        if (verbose) {
            console.log("[Dataquest] Ready...");
        }
    },
    "load": function (path) {
        module.exports.system.checkinit();
        var data;
        try {
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Reading database at \"" + path + "\"");
            }
            data = module.exports.system.modules.fs.readFileSync(path);
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Read database at \"" + path + "\"");
            }
        }
        catch (error) {
            throw module.exports.system.generatethrow("An error has occured while reading the database");
        }
        try {
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Loading database...");
            }
            data = JSON.parse(data);
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Loaded database");
            }
        }
        catch (error) {
            throw module.exports.system.generatethrow("An error has occured while loading the database");
        }
        var database = {
            "database": data,
            "get": function (item) {
                var returns;
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Searching database for item \"" + item + "\"");
                }
                try {
                    returns = this.database[item];
                }
                catch (error) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (returns == null) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Found item \"" + item + "\"");
                }
                return returns;
            },
            "set": function (item, value) {
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Setting item \"" + item + "\" to \"" + value + "\"");
                }
                this.database[item] = value;
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Set item \"" + item + "\" to \"" + value + "\"");
                }
                return true;
            },
            "delete": function (item) {
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Deleting item \"" + item + "\"");
                }
                if (this.database[item] == null) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                try {
                    delete this.database[item];
                }
                catch (error) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Deleted item \"" + item + "\"");
                }
                return true;
            }
        }
        return database;
    },
    "save": function (path, database) {
        module.exports.system.checkinit();
        var data;
        try {
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Processing database...");
            }
            data = JSON.stringify(database.database);
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Processed database");
            }
        }
        catch (error) {
            throw module.exports.system.generatethrow("An error has occured while processing the database");
        }
        try {
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Writing database at \"" + path + "\"");
            }
            module.exports.system.modules.fs.writeFileSync(path, data);
            if (module.exports.system.verbose) {
                console.log("[Dataquest] Wrote database at \"" + path + "\"");
            }
        }
        catch (error) {
            throw module.exports.system.generatethrow("An error has occured while writing the database");
        }
    },
    "createDatabase": function () {
        module.exports.system.checkinit();
        return {
            "database": data,
            "get": function (item) {
                var returns;
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Searching database for item \"" + item + "\"");
                }
                try {
                    returns = this.database[item];
                }
                catch (error) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (returns == null) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Found item \"" + item + "\"");
                }
                return returns;
            },
            "set": function (item, value) {
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Setting item \"" + item + "\" to \"" + value + "\"");
                }
                this.database[item] = value;
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Set item \"" + item + "\" to \"" + value + "\"");
                }
                return true;
            },
            "delete": function (item) {
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Deleting item \"" + item + "\"");
                }
                if (this.database[item] == null) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                try {
                    delete this.database[item];
                }
                catch (error) {
                    //Item doesnt exist
                    throw module.exports.system.generatethrow("Item \"" + item + "\" does not exist");
                }
                if (module.exports.system.verbose) {
                    console.log("[Dataquest] Deleted item \"" + item + "\"");
                }
                return true;
            }
        }
    }
}