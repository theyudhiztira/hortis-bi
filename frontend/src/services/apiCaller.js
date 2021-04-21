import Axios from "axios";

const api = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config) => {
    config.headers = { ...config.headers, Authorization: `Bearer ${localStorage.getItem('hortis_token')}`}

    return config;
}, (error) => {
    return Promise.reject(error);
})

api.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, (error) => {
    if(error.response){
        if (([401, 403]).includes(error.response.status)) {
            localStorage.clear();
            return document.location.replace("/login");
        }
    }

    return Promise.reject(error);
});

export default api;