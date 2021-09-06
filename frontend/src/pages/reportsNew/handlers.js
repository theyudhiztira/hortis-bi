import apiCaller from '../../services/apiCaller'

export const handlers = {
  fetchFirstLineChart: async () => {
    try{
      const lineChart = await apiCaller.get('first-line-chart')

      return [lineChart.data, null]
    }catch(err){
      return [null, err]
    }
  },

  fetchFirstPieChart: async () => {
    try{
      const lineChart = await apiCaller.get('first-pie-chart')

      return [lineChart.data, null]
    }catch(err){
      return [null, err]
    }
  },

  fetchFirstTextChart: async () => {
    try{
      const textReport = await apiCaller.get('first-text-report')

      return [textReport.data, null]
    }catch(err){
      return [null, err]
    }
  },

  fetchDailyChart: async () => {
    try{
      const lineChart = await apiCaller.get('daily-chart')

      return [lineChart.data, null]
    }catch(err){
      return [null, err]
    }
  },
  
  fetchProductionReport: async () => {
    try{
      const tableData = await apiCaller.get('production-report')

      return [tableData.data, null]
    }catch(err){
      return [null, err]
    }
  }
}