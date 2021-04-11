const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const routes = {};

/**
 * Load Main Routes
 */
fs
.readdirSync('./src/routes/')
.filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach(file => {
    const route = require(path.join(`${__dirname}/src/routes`, file))(app);
});