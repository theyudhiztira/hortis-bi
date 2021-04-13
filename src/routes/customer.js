module.exports = (app) => {
    const controller = require('../controllers/customer')
    const validator = require('../validators/customer')
    const checkAuth = require('../middlewares/auth')

    app.post('/customer', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.create)
    app.get('/customer/:id', checkAuth.verifyToken, controller.get)
    app.get('/customer', checkAuth.verifyToken, controller.list)
    //We used the same validator because it's actually doing the same thing
    app.put('/customer/:id', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.edit) 
}