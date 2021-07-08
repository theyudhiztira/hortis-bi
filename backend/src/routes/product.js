module.exports = (app) => {
    const controller = require('../controllers/product')
    const validator = require('../validators/product')
    const checkAuth = require('../middlewares/auth')

    app.post('/product', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.create)
    app.get('/product/:id', checkAuth.verifyToken, controller.get)
    app.get('/product', checkAuth.verifyToken, controller.list)
    //We used the same validator because it's actually doing the same thing
    app.put('/product/:id', checkAuth.verifyToken, checkAuth.adminOnly, controller.edit) 
}