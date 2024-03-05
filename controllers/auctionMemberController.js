const AuctionMembers = require("../models/Auction_Member");

exports.saveAuctionMember = (req, res, next) => {
  AuctionMembers.create(req.body)
    .then(
      (auction) => {
        console.log("Auction Created ", auction);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};
