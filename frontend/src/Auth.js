class Auth {
    isAuthenticated(){
        let token = localStorage.getItem('hortis_token');

        if (token){
            return true;
        }else{
            return false;
        }
    }
}

export default new Auth();