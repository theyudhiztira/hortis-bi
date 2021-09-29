module.exports = (app) => {
    const controller = require('../controllers/home')
    const checkAuth = require('../middlewares/auth')

    app.get('/home', controller.home)
}