import Axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const loginService = async (email, password) => {
    try {
        const doLogin = await Axios.post(`${API_URL}/login`, {
            email,
            password
        });

        localStorage.setItem('hortis_token', doLogin.data.token);
        localStorage.setItem('hortis_user', JSON.stringify(doLogin.data.data));

        return true;

    } catch (err) {
        return {
            error: true,
            response: err.response
        }
    }
}

export const logoutService = async () => {
    try {
        localStorage.removeItem('hortis_token');
        localStorage.removeItem('hortis_user');
    } catch (err) {
        return {
            error: true,
            response: err.response
        }
    }
}