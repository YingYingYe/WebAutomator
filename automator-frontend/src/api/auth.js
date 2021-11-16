import axios from "axios"

export const loginUser = async (data) => {
    try {
        return await axios.post(`/auth/login`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}