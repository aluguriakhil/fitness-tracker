const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const bearer = token.split(' ');
    if (bearer[0] !== 'Bearer') {
      console.error('Token format is incorrect', token);
      return res.status(401).json({ msg: 'Token format is incorrect' });
    }

    const jwtToken = bearer[1];
    // console.log('JWT Token:', jwtToken);
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log('Decoded User:', decoded.user);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
