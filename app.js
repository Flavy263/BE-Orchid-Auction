var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const roleRouter = require("./routes/role");
const productRouter = require("./routes/product");
// const auctionRouter = require("./routes/auction");
const walletRouter = require("./routes/wallet");
const walletHistoryRouter = require("./routes/walletHistory");
const walletRequestRouter = require("./routes/walletRequest");
const cors = require('cors');
var app = express();
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  }
});
const url = "mongodb://127.0.0.1:27017/MutantOrchidAuction";
const connect = mongoose.connect(url);
app.set('socketio', io);
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);
const corsOptions = {
  origin: 'http://127.0.0.1:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/roles", roleRouter);
app.use("/products", productRouter);
// app.use("/auctions", auctionRouter);
app.use("/wallets", walletRouter);
app.use("/walletsHistory", walletHistoryRouter);
app.use("/walletRequest", walletRequestRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var passport = require('passport');
const WalletRequest = require('./models/Wallet_Request');
app.use(session({
  // name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  // store: new FileStore()
}));
server.listen(3001, () => {
  console.log('Socket.IO server is running on port 3001');
});
app.use(passport.session());
app.use(passport.initialize());

module.exports = app;
