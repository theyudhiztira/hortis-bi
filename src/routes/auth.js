module.exports = (app) => {
    const controller = require('../controllers/auth')
    const validator = require('../validators/user')
    
    app.post('/login', validator.login, controller.login)
}