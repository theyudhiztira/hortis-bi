import apiCaller from '../../../services/apiCaller'

const handlers = {
    loadTableData: async (from, to, page, limit) => {
      try{
        const getData = await apiCaller.get('product-category', {
            params: {
                from: from,
                to: to,
                limit: limit ? limit : 5,
                page: page
            }
        })

        return {
          status: true,
          data: getData.data
        }
      }catch(err){
        console.error(err)
        return {
          status: false,
          error: err
        }
      }
    }
}

export default handlers