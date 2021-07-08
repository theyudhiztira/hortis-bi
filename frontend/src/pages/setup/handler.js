import api from "../../services/apiCaller";

const handler = {
  fetchProduct: async () => {
    try{
      const productData = await api.get('product')

      return [productData.data, null]
    }catch(err){
      return [null, err]
    }
  }
}

export default handler;