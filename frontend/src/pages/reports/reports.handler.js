import apiCaller from '../../services/apiCaller'
import moment from 'moment'

const handlers = {
    loadChartDataset: async (mode, year, type) => {
        try{
            const getData = await apiCaller.get('chart-data', {
              params: {
                year: moment(year).format('YYYY'),
                mode: mode,
                type: type
              }
            })

            return getData.data
        }catch(err){
            console.log(err)
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