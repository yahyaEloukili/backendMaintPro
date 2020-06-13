const Sequelize = require('sequelize');
const conn = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const User = conn.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true
  },
  prenom: {
    type: Sequelize.STRING,
    allowNull: false,
    trim: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Merci dentrer un email valid'
      }
    }
  },
  // to verify later
  password: {
    type: Sequelize.STRING,
    allowNull: false,

    validate: {
      len: {
        args: [6],
        msg: 'password doit etre au minimum 6 characters'
      }
    }
  },
  zone_nom: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM,
    values: ['user', 'admin'],
    allowNull: false
  },
  from: {
    type: Sequelize.DATE
  },
  to: {
    type: Sequelize.DATE
  },
  expire: {
    type: Sequelize.INTEGER
  }
});

// encrypt password
User.beforeCreate(async user => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});
//   json web token
User.prototype.getSignedJwtToken = function (user) {
  let exp;
  if (user.to && user.from) {
    exp = Math.floor((new Date(user.to)).getTime() / 1000) - Math.floor(Date.now() / 1000);
  }
  return jwt.sign({ id: this.id }, (process.env.JWT_SECRET), {
    expiresIn: exp || process.env.JWT_EXPIRE
  });
};
// Match user entered password to hashed password in database
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Dont show password
User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
};


User.beforeCreate(async user => {


});

module.exports = User;
