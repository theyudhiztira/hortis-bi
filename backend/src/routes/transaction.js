module.exports = (app) => {
    const controller = require('../controllers/transaction')
    const validator = require('../validators/transaction')
    const checkAuth = require('../middlewares/auth')

    app.post('/transaction', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.create)
    app.get('/transaction/:id', checkAuth.verifyToken, controller.get)
    app.get('/transaction', checkAuth.verifyToken, controller.list)
    // //We used the same validator because it's actually doing the same thing
    // app.put('/transaction/:id', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.edit) 
}