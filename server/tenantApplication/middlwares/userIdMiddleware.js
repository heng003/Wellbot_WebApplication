const jwt = require('express-jwt');

const authenticate = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth', // The property on req object where the payload will be attached
});

module.exports = authenticate;