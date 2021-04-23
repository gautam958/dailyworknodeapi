const http = require('http');
var express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
// mongdb is not using now
//const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');

const config = require('./config/db');

// Use Node's default promise instead of Mongoose's promise library
mongoose.Promise = global.Promise;

mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

let db = mongoose.connection;

db.on('open', () => {
    console.warn('Connected to the database  ', db.name);
});

db.on('error', (err) => {
    console.log(`Database error: ${err + db}`);
});
var app = express();

app.enable('trust proxy');

app.use(express.static('public'));

// Set body parser middleware
app.use(bodyParser.json());

// Enable cross-origin access through the CORS middleware
// NOTICE: For React development server only!
if (process.env.CORS) {
    app.use(cors());
}
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// Initialize routes middleware
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ err: err });
});

const pathToData = path.resolve(__dirname, "Public");
const virtualPath = path.resolve(__dirname);
console.warn('public path ', pathToData);
console.warn('virtual path ', virtualPath);

const port = process.env.PORT || config.PortNumber;

// app.route('/*')
// .get((req, res) => {
//   res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
// });
app.get('/', (req, res) => {
    res.send("<h1>Hellow from nodejs api used with mongodb</h1>");
});
// Listen on port 8080
var listener = app.listen(port, () => {
    console.log(`Node Api running on port   http://localhost:${port} `);
});