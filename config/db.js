const Sequelize = require("sequelize");
const envDb = process.env.NODE_ENV || 'developement';
const config = require(__dirname + '/configDb.json')[envDb.trim()];
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $gt: Op.gt,
  $gte: Op.gte,
  $ne: Op.ne,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
  $lt: Op.lt,
  $lte: Op.lte,
  $lk: Op.like
};

console.log("conf =================>",config);

const db = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config, // host and dialect
    pool: {
      max: 8,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
);

module.exports = db;

