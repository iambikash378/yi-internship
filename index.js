"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var dotenv_1 = require("dotenv");
var sqlite3_1 = require("sqlite3");
sqlite3_1.default.verbose();
var db = new sqlite3_1.default.Database('./database/librarydb.sqlite', function (err) {
    if (err) {
        console.log("Error opening database", err);
    }
    else {
        console.log("Database opened successfully");
    }
});
db.serialize(function () {
    db.run("\n        CREATE TABLE IF NOT EXISTS migrations (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT UNIQUE,\n        applied_at DATETIME DEFAULT CURRENT_tIMESTAMP)");
});
dotenv_1.default.config();
var PORT = process.env.PORT || 8000;
var server = (0, http_1.createServer)();
server.on("request", function (req, res) {
    console.log("New request received");
    switch (req.url) {
        case '/authors': {
            if (req.method === 'GET') {
            }
            else if (req.method === 'POST') {
            }
            break;
        }
        case '/books': {
            if (req.method === 'GET') {
            }
            else if (req.method === 'POST') {
            }
        }
    }
    res.end("Hello from server");
});
server.on("connection", function () {
    console.log("New connection established !");
});
server.on("error", function (error) {
    console.error("Server error:", error);
});
server.listen(PORT, function () {
    console.log("Server started .Listening on port ".concat(PORT));
});
