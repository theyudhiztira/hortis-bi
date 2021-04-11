module.exports = (app) => {
    const auth = require('../controllers/auth.js')
    const verify = require('../validators/agents')

    app.post('/login', verify.login, auth.login)
    app.post('/verify-token', auth.verifyToken)
}