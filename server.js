require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const PORT = process.env.PORT || 2012;
const Route = require('./routes/Router');
const socketio = require('socket.io');
const io = socketio(server);
const mysqlStore = require('express-mysql-session')(session);
//const onlineSockets=require('./controllers/activeUserController');
const socketService = require('./services/OnlineUsersServices');
const { info } = require('console');
//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
let option = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
};
let sessionStore = new mysqlStore(option);
app.use(session({
    key: 'session_cookie_name',
    secret: 'nmoanfuni secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(Route);
// end of the app configuration functions and the commands


//adding the services and socket management events
let ConnectedUsers = [];
io.on('connection', (socket) => {
    //adding the connected user to the active users array
    socket.on('connected', (data) => {
        let newUser = {
            name: data.username,
            id: data.userid,
            socketID: socket.id
        };
        if (ConnectedUsers.length > 0) {
            let index = ConnectedUsers.findIndex(user => user.name === newUser.name);
            if (index !== -1) {
                ConnectedUsers.splice(index, 1)[0];
                ConnectedUsers.push(newUser);
            } else {
                ConnectedUsers.push(newUser);
            }
        } else {
            ConnectedUsers.push(newUser);
        }
        socket.broadcast.emit('userConnect', { name: newUser.name });
        io.emit('connectedUsers', ConnectedUsers);
    })

    //on user log out
    socket.on('loggedout', (user) => {
        let name = user.username;
        let index = ConnectedUsers.findIndex(user => user.name === name);
        if (index !== -1) {
            ConnectedUsers.splice(index, 1)[0];
        }
        io.emit('connectedUsers', ConnectedUsers);
    })

    // conneected friends refresh
    socket.emit('connectedfriends', ConnectedUsers);

    //receiving chat message
    socket.on('chatmessage', (messagedetails) => {
        let messagecontent = messagedetails.messageDetails;
        let messageBody = {
            senderID: messagecontent.senderID,
            receiverID: messagecontent.receiverID,
            message: messagecontent.message,
            messageID: messagecontent.messageID,
            sendertime: messagecontent.sendertime,
            socketID: messagecontent.socketID,
        }
        let socketPort = messagecontent.socketID;
        //console.log(socketPort);
        socket.broadcast.to(socketPort).emit('chatmessage', (messagecontent));
        socketService.saveMessage(messageBody);
    })

    socket.on('typing', (data) => {
        let info = data;
        socket.broadcast.to(info.socketID).emit('typing', info);
    })

    socket.on('online', (data) => {
        let info = data;
        socket.broadcast.to(data.socketID).emit('online', info);
    })























})






























server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})