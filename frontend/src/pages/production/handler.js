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

  getCustomer: async () => {
    try{
      const customerData = await apiCaller.get('customer')

      return [customerData.data, null]
    }catch(err){
      return [null, err]
    }
  },

  sendDataToServer: async (date, cart, supplier) => {
    try{
      await apiCaller.post('productions', {
        date: date,
        supplier: supplier,
        cart: cart
      })

      return [true, null]
    }catch(err){
      return [null, err]
    }
  },

  loadTransactionData: async (from, to, limit, page, date) => {
    try{
      const getData = await apiCaller.get('productions', {
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
      const getDetails = await apiCaller.get(`productions/${id}`)

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