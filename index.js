const http = require('http');
var express = require("express");
const MongoClient = require("mongodb").MongoClient;
//const MONGODB_URL = 'mongodb+srv://gautam:9955771618@clustergautam958.i5ruh.azure.mongodb.net';
const MONGODB_URL = 'mongodb://localhost:27017';
DB_NAME = 'DailyWork';
var db;
var app = express();
var bodyParser = require("body-parser");
const client = new MongoClient(MONGODB_URL, {
    useNewUrlParser: true
});
app.use(express.static("public"));

client.connect(err => {
    var dbUsers = [];
    console.log("Connected successfully to database");

    console.warn('connection string ', MONGODB_URL);
    console.warn('DB Name ', DB_NAME);

    db = client.db(DB_NAME);



    // // Removes any existing entries in the users collection
    // db.collection("Users").deleteMany({ name: { $exists: true } }, function (
    //     err,
    //     r
    // ) {
    //     for (var i = 0; i < users.length; i++) {
    //         // loop through all default users
    //         dbUsers.push({ name: users[i] });
    //     }
    //     // add them to users collection
    //     db.collection("users").insertMany(dbUsers, function (err, r) {
    //         console.log("Inserted initial users");
    //     });
    // });
});

const hostname = '127.0.0.1';
//const port = 8080;
const port = 5101;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });

// Send user data - used by client.js
app.get("/users", function (request, response) {
    db.collection("Users")
        .find()
        .toArray(function (err, users) {
            // finds all entries in the users collection
            response.send(users); // sends users back to the page
        });
});
app.post("/new", urlencodedParser, function (request, response) {
    db.collection("users").insert([{ userid: request.body.user }], function (
        err,
        r
    ) {
        console.log("Added a user");
        response.redirect("/");
    });
});

// app.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

// Listen on port 8080
var listener = app.listen(port, function () {
    console.log("Listening on port " + listener.address().port);
});