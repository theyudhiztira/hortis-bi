module.exports = {
    /**
     * 
     * @param {object} res fetched from app router res
     * @param {number} customMessage **optional** custom error message 
     * @param {number} customCode **optional** custom error code please refer to {@link https://httpstatuses.com} 
     * @returns {function} 
     */
    errorResponse: (res, customMessage, customCode) => {
        return res.status(customCode ? customCode : 500).send({
            message: customMessage ? customMessage : "Internal server occured"
        })
    }
}