import axios from 'axios';

async function registerUser(username, password, email) {
    try {
        const data = {
            username: username,
            password: password,
            mail: email
        }
        const url = "https://kdmp7m5a39.execute-api.us-east-1.amazonaws.com/createUser"
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default registerUser;