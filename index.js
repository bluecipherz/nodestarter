// let compression = require('compression');
// let express     = require('express');
// let bodyParser  = require('body-parser');
// let morgan      = require('morgan');
// let http        = require('http');
// let utils       = require('./src/common/ulits');
//
//
//
// let app = express();
//
// let apiport = 3100;
// let server = http.Server(app);
// let io = require('socket.io')(server);
//
// app.use(compression());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(morgan('dev'));
// app.use(function(req, res, next) {
//      res.header("Access-Control-Allow-Origin", req.headers.origin);
//      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//      next();
// });
//
// io.on('connection',function (client) {
//
//     client.on('disconnect', function () {
//         disconnect();
//     });
//
// });
//
// app.get('/', function(req, res){
//  res.send('what???', 404);
// });
//
//
// app.post('/awesome', function(req, res){
//
//     mysql.getmysqlconnandrun(function(err){
//         console.log('Connection Failure', err);
//     }, mysql.queryErrSucc('select * from basi', [],
//         resp=>utils.failReply(resp, 'FaiLuir', res),
//         resp=>utils.succReply(resp, 'FaiLuir', res)
//     ));
//
// });
//
//
// server.listen(apiport, function(){
//  console.log('Platform REST API server listening at :' + apiport);
// });


let compression = require('compression');
let express     = require('express');
let bodyParser  = require('body-parser');
let morgan      = require('morgan');
let jwt    = require('jsonwebtoken');
let http = require('http');


let appconfig = require('./app/config/appconfig.js');
let jwtconfig = require('./app/config/jwtconfig.js');
let mysqlconfig = require('./app/config/mysqlconfig.js');

let app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/userdocs', express.static(appconfig.userdoc_basedir));

require('./app/login/loginRoutes.js')(app, console);

let server = http.Server(app);

server.listen(appconfig.apiport, function(){
    console.log('Platform REST API server listening at :' + appconfig.apiport);
});