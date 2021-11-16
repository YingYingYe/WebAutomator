import axios from "axios"

export const getSaveList = async (type) => {
    try {
        return await axios.get(`/db/savelist/${type}/get`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const saveToSavelist = async (data, type) => {
    try {
        return await axios.post(`/db/savelist/${type}/save`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const updateToSavelist = async (data, type) => {
    try {
        return await axios.post(`/db/savelist/${type}/update`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const deleteFromSavelist = async (keyword, type) => {
    try {
        return await axios.get(`/db/savelist/${type}/delete/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}