const Auctions = require("../models/Auction");

exports.getAllAuction = (req, res, next) => {
  Auctions.find()
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createAuction = (req, res, next) => {
  Auctions.create(req.body)
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

exports.getAuctionByID = (req, res, next) => {
  Auctions.findById(req.params.auctionId)
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionNotYetAuctionedByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "not yet auctioned" })
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAboutToAuctionByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "about to auction" })
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAuctioningByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "auctioning" })
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};
exports.getAuctionaAuctionedByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "auctioned" })
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.updateAuctionByID = (req, res, next) => {
  Auctions.findByIdAndUpdate(
    req.params.auctionId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteAuctionByID = (req, res, next) => {
  Auctions.findByIdAndDelete(req.params.auctionId)
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};
