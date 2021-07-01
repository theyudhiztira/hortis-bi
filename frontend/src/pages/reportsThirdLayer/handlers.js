import apiCaller from '../../services/apiCaller'

export const handlers = {
  fetchFirstLineChart: async (data) => {
    try{
      const lineChart = await apiCaller.get('first-line-chart', {
        params: {
          type: data,
          mode: 'product_entries'
        }
      })

      return [lineChart.data, null]
    }catch(err){
      return [null, err]
    }
  },

  fetchFirstPieChart: async (data) => {
    try{
      const lineChart = await apiCaller.get('first-pie-chart', {
        params: {
          type: data,
          mode: 'product_entries'
        }
      })

      return [lineChart.data, null]
    }catch(err){
      return [null, err]
    }
  },

  fetchFirstTextChart: async (data) => {
    try{
      const textReport = await apiCaller.get('first-text-report', {
        params: {
          type: data,
          mode: 'product_entries'
        }
      })

      return [textReport.data, null]
    }catch(err){
      return [null, err]
    }
  }
}