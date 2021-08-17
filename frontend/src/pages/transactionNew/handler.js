import apiCaller from '../../services/apiCaller'

export const handlers = {
  fetchProducts: async () => {
    try{
      const productData = await apiCaller.get('product')

      return [productData.data, null]
    }catch(err){
      return [null, err]
    }
  },

  deleteDataFromServer: async (id) => {
    try{
      const deleteProduct = await apiCaller.delete('transaction/'+id)

      return [deleteProduct.data, null]
    }catch(err){
      return [null, err]
    }
  },

  sendDataToServer: async (date, cart) => {
    try{
      await apiCaller.post('transaction', {
        date: date,
        cart: cart
      })

      return [true, null]
    }catch(err){
      return [null, err]
    }
  },

  loadTransactionData: async (from, to, limit, page, date) => {
    try{
      const getData = await apiCaller.get('transaction', {
        params: {
          from: from,
          to: to,
          limit: limit ? limit : 5,
          page: page,
          date: date
        }
      })

      return [getData.data, null]
    }catch(err){
      console.error(err)
      return [null, err]
    }
  },

  fetchTransaction: async (id) => {
    try{
      const getDetails = await apiCaller.get(`transaction/${id}`)

      return [getDetails.data, null]
    }catch(err){
      return [null, err]
    }
  },

  removeTransaction: async (id) => {
    try{
      const getDetails = await apiCaller.delete(`transaction/${id}`)

      return [getDetails.data, null]
    }catch(err){
      return [null, err]
    }
  }
}