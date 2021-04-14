const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        try{
            const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY)
            req.userData = decodedToken;

            req.query.limit = req.query.limit ? req.query.limit > 50 ? 50 : req.query.limit : 10;
            req.query.page = req.query.page ? req.query.page < 1 ? 1 : req.query.page : 1;

            next();
        }catch(error){
            return res.status(403).send({
                message: 'Auth Failed'
            });
        }
    },

    /**
     * 
     * @returns {(function|object)} If the user is not allowed to access this endpoint it will return 403 error code.
     */
    adminOnly: (req, res, next) => {
        if(req.userData.role !== 'admin'){
            return res.status(403).send({
                message: "Sorry you are unable to do this action!"
            })
        }

        return next()
    }
}