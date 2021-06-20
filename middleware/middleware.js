const jwt = require("jsonwebtoken");

const requestInfo = (req, res, next) => {
  console.log("\nREQUEST", req.path);
  console.log("METHOD", req.method);
  next();
};

const paramLogger = (req, res, next) => {
  if (req.params) {
    console.log("\nPARAMS");
    console.table(req.params);
    req.paramsChecked = true;
  } else {
    req.paramsChecked = false;
  }
  next();
};

const authVerify = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userAuth = { userId: decoded.userId, email: decoded.email };
    if (decoded.userId !== String(req.user._id)) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised access, put valid token",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, see the error message for more details",
  });
};

module.exports = { requestInfo, paramLogger, errorHandler, authVerify };
