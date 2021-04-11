module.exports = {
    /**
     * 
     * @param {object} res fetched from app router res
     * @param {string} customMessage **optional** custom error message 
     * @returns {function}
     */
    internalServerError: (res, customMessage) => {
        return res.status(500).send({
            message: customMessage ? customMessage : "Internal server occured"
        })
    }
}