import apiCaller from '../../services/apiCaller'

const handlers = {
    loadTransactionData: async (from, to, limit, page) => {
        try{
            const getData = await apiCaller.get('transaction', {
                params: {
                    from: from,
                    to: to,
                    limit: limit ? limit : 5,
                    page: page
                }
            })

            console.log(getData.data)
            return getData.data
        }catch(err){
            console.error(err)
            return false
        }
    },

    getDetails: async (transactionId) => {
        try{
            const getData = await apiCaller.get(`transaction/${transactionId}`)

            return getData.data
        }catch(err){
            console.log(err)
            return false
        }
    }
}

export default handlers