const jwt = require('jsonwebtoken');
// /////////////////////
const verifyAdminToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  console.log(authToken,"authToken")

  if (!authToken) {
    return res.status(401).json({ message: 'Authorizationa admin token not found' });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ")
    token = token[1]
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

    // console.log(decoded,"docoded")

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not a admin user' });
    }

    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token',error:error });
  }
};

const verifySubadminToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }
  console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ")
    token = token[1]
    const decoded = jwt.verify(token, process.env.SUBADMIN_SECRET_KEY);
    console.log(decoded,"docoded")

    if (decoded.role !== 'subadmin') {
      return res.status(403).json({ message: 'Access denied. Not a subadmin user' });
    }

    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token',error:error });
  }
};


const verifyUserToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  console.log(authToken,"authToken")

  if (!authToken) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ")
    token = token[1]
    console.log(token[1],"token[1]")
    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    console.log(decoded,"docoded")

    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. Not a user' });
    }

    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token',error:error });
  }
};


module.exports = 
 { verifySubadminToken,
  verifyAdminToken,
  verifyUserToken
}

