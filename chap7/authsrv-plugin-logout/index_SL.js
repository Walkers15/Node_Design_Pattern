module.exports = (serviceLocator) => {
    const authService = serviceLocator.get('authService');
    const db = serviceLocator.get('db');
    const app = serviceLocator.get('app');

    const tokensDb = db.sublevel('tokens');

    const oldLogin = authService.login;
    authService.login = (username, password, callback) => {
        oldLogin(username, password, (err, token) => {
            if (err) return callback(err);

            tokensDb.put(token, {username: username}, () => {
                callback(null, token);
            });
        });
    };

    const oldCheckToken = authService.checkToken;
    authService.checkToken = (token, cb) => {
        console.log(cb);
        tokensDb.get(token, function (err, res) {
            if (err) return cb(err);
            oldCheckToken(token, cb);
        });
    }

    authService.logout = (token, cb) => {
        tokensDb.del(token, cb);
    }

    app.get('/logout', (req, res, next) => {
        authService.logout(req.query.token, function () {
            res.status(200).send({ok: true});
        });
    });
}