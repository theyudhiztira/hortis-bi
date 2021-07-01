import apiCaller from '../../../services/apiCaller'

const handlers = {
  sendDataToServer: async (value) => {
    try{
      const data = await apiCaller.post('product-category', {
        name: value
      })

      return {
        status: true,
        data: data.data
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