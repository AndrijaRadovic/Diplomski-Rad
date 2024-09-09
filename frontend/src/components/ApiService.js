import axios from "axios"

class ApiService{
    
    async login(user){

        try{
            const response = await axios.post('https://localhost:7028/api/Auth/login', user);
            this.setLoginInfo(response.data.uloga, response.data.sifraKorisnika, response.data.token);
            console.log(user);
            console.log(response.data);
            return response.data;
        }catch(error){
            console.error('Error during login', error);
            throw error;
        }
    }

    setLoginInfo(role, id, token){
        window.sessionStorage.setItem("role", role);
        window.sessionStorage.setItem("userId", id);
        window.sessionStorage.setItem("token", token);
    }

    deleteLoginInfo(){
        window.sessionStorage.clear();
    }

    async createProduct(product) {
        try {
            const response = await axios.post('https://localhost:7028/api/Products', product, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product', error);
            throw error;
        }
    }

    async createUser(korisnik) {
        try {
            const response = await axios.post('https://localhost:7028/api/Users', korisnik, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user', error);
            throw error;
        }
    }

    async changePassword(request){
        try{
            const response = await axios.put(`https://localhost:7028/api/Users/${window.sessionStorage.getItem('userId')}/password`, request, {
                headers:{
                    Authorization: `Bearer ${this.getToken()}`,
                }
            });
            return response.data;
        } catch(error){
            console.error('Error updating password: ', error);
            throw error;
        }
    }

    async getAllUsers(){
        try{
            const response = await axios.get('https://localhost:7028/api/Users', {
                headers:{
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch(error){
            console.error('Error fetching users: ', error);
            throw error;
        }
    }

    async findUsers(filter){
        try{
            const response = await axios.get(`https://localhost:7028/api/Users/search/${filter}`, {
                headers:{
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch(error){
            console.error('Error fetching users: ', error);
            throw error;
        }
    }

    async getUser(id){
        try{
            console.log(`https://localhost:7028/api/Users/${id}`);
            const response = await axios.get(`https://localhost:7028/api/Users/${id}`, {
                headers:{
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch(error){
            console.error('Error fetching user', error);
            throw error;
        }
    }

    async updateUser(korisnik) {
        try {
            const response = await axios.put(`https://localhost:7028/api/Users/${korisnik.sifraKorisnika}`, korisnik, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user', error);
            throw error;
        }
    }

    async deleteUser(id){
        try{
            const response = await axios.delete(`https://localhost:7028/api/Users/${id}`, {
                headers:{
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data
        }catch (error) {
            console.error('Error deleting user', error);
            throw error;
        }
    }

    getToken(){
        return window.sessionStorage.getItem('token');
    }
}

const apiService = new ApiService();

export {apiService};