import config from "config";
import jwt from "jsonwebtoken";

import messages from "../utils/messages.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If there's no token, return an error
  if (!token) {
    return res
      .status(401)
      .send({ message: messages.authorization.missingTokenErr });
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, config.get("secrets.jwtPrivateKey"));

    const { user, tokenValidation } = decoded;
    // check that token validation key is the same saved in user obj in db
    // to make sure that user didn't logout or change password from other device
    const { tokenValidation: dbTokenValidation } = await User.findById(
      user.id
    ).lean();
    if (dbTokenValidation !== tokenValidation) {
      return res
        .status(401)
        .send({ message: messages.authorization.tokenExpiredErr });
    }

    // Add the decoded user object to the request object for further use
    req.user = decoded.user;

    next();
  } catch (err) {
    const { name, message } = err;
    return res.status(401).send({ message: `${name}: ${message}` });
  }
};

export default auth;
