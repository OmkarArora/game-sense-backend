const requestInfo = (req, res, next) => {
  console.log("\nREQUEST", req.path);
  console.log("METHOD", req.method);
  next();
}

const paramLogger = (req, res, next) => {
  if(req.params){
    console.log("\nPARAMS");
    console.table(req.params);
    req.paramsChecked = true;
  }else{
    req.paramsChecked = false;
  }
  next();
}

const checkAuth = (req, res, next) => {
  const {name, password} = req.query;
  console.log(req.query);
  if(name && name==="halfcold"){
    if(password && password==="shoto"){
      const user = {name, password};
      req.user = user;
      next();
    }
    else{
      res.status(401).json({success: false, message: "Password incorrect or missing"});
    }
  }
  else{
    res.status(401).json({success: false, message: "Name incorrect or missing"});
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({success: false, message: "error occurred, see the error message for more details"});
}

module.exports = { requestInfo, paramLogger, errorHandler }