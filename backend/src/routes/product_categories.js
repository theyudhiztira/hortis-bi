module.exports = (app) => {
    const controller = require('../controllers/product_categories')
    const validator = require('../validators/product_categories')
    const checkAuth = require('../middlewares/auth')

    app.post('/product-category', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.create)
    app.get('/product-category/:id', checkAuth.verifyToken, controller.get)
    app.get('/product-category', checkAuth.verifyToken, controller.list)
    app.get('/product-sub-category', controller.subCatList)
    //We used the same validator because it's actually doing the same thing
    app.put('/product-category/:id', checkAuth.verifyToken, checkAuth.adminOnly, validator.create, controller.edit) 
}