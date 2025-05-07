
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      return res.status(401).send({
        message: "Session Expired. Please Login Again",
      });
    }
  };
  
  module.exports = isAuth;
  