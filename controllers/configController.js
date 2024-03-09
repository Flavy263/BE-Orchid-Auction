const Configs = require("../models/Config");

exports.getAllConfig = (req, res, next) => {
  Configs.find({})
    .then(
      (config) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(config);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createConfig = (req, res, next) => {
  Configs.create(req.body)
    .then(
      (config) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(config);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteConfigs = (req, res, next) => {
  Configs.deleteMany({})
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
exports.getConfigByConfigId = (req, res, next) => {
    Configs.findOne(req.params.type_config)
      .then(
        (config) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(config);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  };

exports.getConfigByTypeConfig = (req, res, next) => {
  Configs.findOne(req.params.type_config)
    .then(
      (config) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(config);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.updateConfigById = (req, res, next) => {
  Configs.findByIdAndUpdate(
    req.params.config_id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (config) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(config);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteConfigByID = (req, res, next) => {
  Configs.findByIdAndDelete(req.params.config_id)
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

