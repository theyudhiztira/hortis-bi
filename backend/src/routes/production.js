module.exports = (app) => {
    const controller = require('../controllers/production')
    const validator = require('../validators/production')
    const checkAuth = require('../middlewares/auth')

    app.post('/productions', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.create)
    app.get('/productions', checkAuth.verifyToken, controller.list)
    app.get('/productions/:id', checkAuth.verifyToken, controller.get)
    app.delete('/productions/:id', checkAuth.verifyToken, controller.delete)
}