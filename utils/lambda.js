import axios from 'axios';

async function useLambda(endpoint, data) {
    try {
        const url = "https://kdmp7m5a39.execute-api.us-east-1.amazonaws.com/"
        const response = await axios.post(`${url}${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default useLambda;