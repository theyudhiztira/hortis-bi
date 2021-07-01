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
    },

    /**
     * To parse pagination data
     * @param {number} totalRows Total rows of data
     * @param {number} page Current page / requested page 
     * @param {number} limit Limit per page
     * @returns {obejct} 
     */
    pageData:(totalRows, page, limit) => {
      const currentPage = page ? parseInt(page) : 1
      const totalPages = Math.ceil(totalRows / limit); 

      return {currentPage, totalPages}
    }, 

    /**
     * To offset limit of data
     * @param {number} page Current page / requested page 
     * @param {number} limit Limit per page
     * @returns {obejct} 
     */
    limitOffset: (page, limit) => {
        const queryLimit = limit ? parseInt(limit) : 3
        const queryOffset = page ? (page-1) * limit : 0

        return {queryLimit, queryOffset}
    },
}