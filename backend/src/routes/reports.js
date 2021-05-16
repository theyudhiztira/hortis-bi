module.exports = (app) => {
    const controller = require('../controllers/report')
    const checkAuth = require('../middlewares/auth')

    app.get('/report', checkAuth.verifyToken, checkAuth.adminOnly, controller.chartReports)
}