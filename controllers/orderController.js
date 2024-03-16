const Order = require("../models/Order");


exports.getOrders = (req, res, next) => {
  Order.find({})
    .populate({
      path: "winner_id",
      populate: {
        path: "role_id"
      }
    })
    .populate({
      path: "auction_id",
      populate: [
        { path: "product_id" },
        { path: "host_id" }
      ]
    })
    .populate("host_id")
    .then(
      (course) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(course);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

