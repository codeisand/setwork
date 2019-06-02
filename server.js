const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
// const logger = require ('morgan');

const app = express();

app.use(cors());



const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const {User} = require('./Helpers/UserClass');

require('./socket/streams')(io, User, _); 
require('./socket/private')(io); 

const dbconfig = require('./config/secret');
const auth = require('./route/authRoutes');
const posts = require('./route/postRoutes');
const users = require('./route/userRoutes');
const friends = require('./route/friendsRoutes');
const message = require('./route/messageRoute');
const image = require('./route/imageRoute');

// app.use((req, res, next)  => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

 
app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({extended: true}, {limit : '50mb'}));

app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect( dbconfig.url, {useNewUrlParser: true} );





app.use('/api/instagram', auth);
app.use('/api/instagram', posts);
app.use('/api/instagram', users);
app.use('/api/instagram', friends);
app.use('/api/instagram', message);
app.use('/api/instagram', image);

server.listen(3000, () => {
    console.log("working");
});  