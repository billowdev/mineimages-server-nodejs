const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const { id, firstName, lastName, email, permission } = user;
  const accessToken = sign(
    { id, firstName, lastName, email, permission },
    process.env.JWT_SECRET
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken =  req.header('access-token') || req.cookies['access-token'];
  if (!accessToken) {
    return res
      .status(403)
      .send({ sucess: false, error: "user not authenticated !" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);

    req.user = validToken;
    if (validToken) {
      req.user.authenticated = true;
      return next();
    }
  } catch (err) {
    return res
      .status(401)
      .send({ sucess: false, error: `Invalid Token - ${err}` });
  }
};

// const validateToken = (req, res, next) => {
	
// 	const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies['access-token'];
// 	if (!token) {
// 		return res.status(403).send(" A token is required for authentication");
// 	}

// 	try {
// 		const decoded = verify(token, process.env.JWT_SECRET);
// 		req.user = decoded;
// 	} catch (err) {
// 		return res.status(401).send(`Invalid Token ${token} ${err}`);
// 	}
// 	return next();
// }

module.exports = { createTokens, validateToken };
