var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const roleRouter = require("./routes/role");
const productRouter = require("./routes/product");
const auctionRouter = require("./routes/auction");
const auctionBidRouter = require("./routes/auctionBid");
const walletRouter = require("./routes/wallet");
const ReportRequestRouter = require("./routes/reportRequest");
const ConfigRouter = require("./routes/config");
const orderRouter = require("./routes/order");

const Orders = require("./models/Order")
const Auction = require("./models/Auction")
const Auction_bid = require("./models/Auction_Bid")

const cors = require("cors");
var app = express();
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// const url = "mongodb+srv://nguyenhoangphat852:TX0TzRNCxPcAuB8n@cluster0.k6s0uzi.mongodb.net/?retryWrites=true&w=majority";
const url = "mongodb://127.0.0.1:27017/MutantOrchidAuction";
const connect = mongoose.connect(url);
app.set("socketio", io);
io.on("connection", (socket) => {
  console.log("A client connected");
  socket.on("auctionEnded", async (data) => {
    try {
      console.log("dataaaa", data);

      // Kiểm tra trạng thái của đấu giá trước khi tạo order
      const auction = await Auction.findById(data.auction_id);

      const endTime = new Date(auction.end_time).getTime();
      const currentTime = new Date(data.date).getTime();

      // if (currentTime >= endTime) {
      //   console.log("Auction has ended. Cannot create new order.");
      //   return;
      // }

      // Tạo order dựa trên thông tin nhận được từ client
      const highestBid = await Auction_bid.findOne({ auction_id: data.auction_id })
        .sort({ price: -1 }) // Sắp xếp theo giá giảm dần để lấy giá lớn nhất
        .limit(1);
      console.log("highhh", highestBid);
      const orderId = await Orders.findOne({ auction_id: data.auction_id })
      if (orderId) {
        console.log(orderId);
        console.log("Auction has created. Cannot create new order.");
        return;
      }
      const order = await Orders.create({
        winner_id: highestBid.customer_id,
        auction_id: highestBid.auction_id,
        host_id: data.host_id,
        price: highestBid.price,
      });

      await Auction.findByIdAndUpdate(data.auction_id, { status: "auctioned" });
      console.log("Order Created ", order);
    } catch (err) {
      console.error("Error creating order: ", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
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
  origin: "*", // Allow any origin
  // origin: ["http://localhost:3010", "http://127.0.0.1:5173"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Thêm PUT, PATCH và DELETE vào đây
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", roleRouter);
app.use("/products", productRouter);
app.use("/auctions", auctionRouter);
app.use("/auctionBid", auctionBidRouter);
app.use("/wallets", walletRouter);
app.use("/report_requests", ReportRequestRouter);
app.use("/configs", ConfigRouter);
app.use("/orders", orderRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var passport = require("passport");
const AuctionBid = require("./models/Auction_Bid");
const Order = require("./models/Order");

app.use(
  session({
    // name: 'session-id',
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    // store: new FileStore()
  })
);
server.listen(3001, () => {
  console.log("Socket.IO server is running on port 3001");
});
app.use(passport.session());
app.use(passport.initialize());

module.exports = app;
