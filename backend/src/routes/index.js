const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

module.exports = (app) => {
    /**
     * Load Main Routes
     */
    fs
    .readdirSync('./src/routes')
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        require(path.join(`${__dirname}/`, file))(app);
    });
}