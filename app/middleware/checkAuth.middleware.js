const jwt = require('jsonwebtoken');
const config = require('config');

class CheckAuth {

    getToken(req, res) {
        const token = req.header('x-auth-token');
        if (!token)
            return res.status(401).send('عدم دسترسی؛ لطفا وارد حساب خود شوید');
        else
            return token;
    }
    decoded(token) {

        return jwt.verify(token, config.get('jwtPrivateKey'));

    }
    checkAccess(req, res, next, decoded, condition) {
        try {
            req.user = decoded;
            console.log()
            if (condition) next();
            else return res.status(401).send('عدم دسترسی');
        } catch (ex) {
            res.status(400).send('عدم دسترسی؛ لطفا وارد حساب خود شوید');
        }
    };
    setUserIdToHeader(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        const decoded = checkAuth.decoded(token);
        const userId = decoded._id;
        req.headers.userId = userId;
        next();
    }

    authAdmin(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        const decoded = checkAuth.decoded(token);
        const condition = decoded.isAdmin === true;
        checkAuth.checkAccess(req, res, next, decoded, condition);
    }
    authUser(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        const decoded = checkAuth.decoded(token);
        const condition = decoded._id === req.params.id || decoded.isAdmin;
        checkAuth.checkAccess(req, res, next, decoded, condition);
    }
    auth(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        const decoded = checkAuth.decoded(token);
        const condition = !!decoded.melliCode;
        checkAuth.checkAccess(req, res, next, decoded, condition);
    }
    authVote(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        const userId = req.body.userId;
        const decoded = checkAuth.decoded(token);
        const condition = decoded._id === userId;
        console.log(decoded._id, userId)
        checkAuth.checkAccess(req, res, next, decoded, condition);
    }

}
module.exports = CheckAuth;