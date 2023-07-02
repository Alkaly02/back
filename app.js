// 'use strict';
require('dotenv').config()
const debug = require('debug')('my express app');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const connectToMongoDB = require('./config/db')

const routes = require('./routes/index');
const users = require('./routes/userRoute');
const cours = require('./routes/courRoute');

const app = express();


app.use(cors())

// database connexion
connectToMongoDB()

const port = process.env.PORT || 5050

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/cours', cours);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

// app.set('port', process.env.PORT || 5500);

// var server = app.listen(app.get('port'), function () {
//     console.log('sever is running at: ', `http://localhost:${app.get('port')}`);
//     debug('Express server listening on port ' + server.address().port);
// });
// mongodb+srv://alkaly:<password>@cluster0.rbedjxx.mongodb.net/
// mongoose.connect('mongodb+srv://alkaly:npmstart@cluster0.ibrf2h3.mongodb.net/')
//     .then(() => {
//         app.listen(app.get('port'), () => {
//             console.log("Database connection is Ready "
//                 + "and Server is Listening on Port ", app.get('port'));
//         })
//     })
//     .catch((err) => {
//         console.log("A error has been occurred while"
//             + " connecting to database. ", err);
//     })

app.listen(port, () => console.log("The server is running on port : ", port))