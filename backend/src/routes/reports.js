module.exports = (app) => {
    const controller = require('../controllers/report')
    const checkAuth = require('../middlewares/auth')

    // app.get('/chart-data', checkAuth.verifyToken, checkAuth.adminOnly, controller.chartReports)
    // app.get('/download-report-pdf', checkAuth.verifyToken, checkAuth.adminOnly, controller.downloadPDFReport)
    app.get('/download-report-pdf', controller.downloadPDFReport)
    app.get('/table-data', checkAuth.verifyToken, checkAuth.adminOnly, controller.tableData)
    app.get('/first-line-chart', controller.firstLineChart)
    app.get('/first-pie-chart', controller.firstPieChart)
    app.get('/first-text-report', controller.firstTextReport)
}