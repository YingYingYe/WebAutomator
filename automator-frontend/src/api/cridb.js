import axios from "axios"

export const getDbPediaByKeyword = async (keyword) => {
    try {
        return await axios.get(`/api/dbpedia/search/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getImageFileNames = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getimagefilenames/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getDownloadableImageURL = async (keyword) => {
    try {
        return await axios.get(`/api/wikimedia/getimageurl/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getPerson = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getperson/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getWikiCoord = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getcoord/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getCoordinate = async (keyword) => {
    try {
        return await axios.get(`/api/geonames/getcoordinate/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}


// Save
// Create
export const saveCreateThing = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/create/thing`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveCreateEvent = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/create/event`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveCreateMedium = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/create/medium`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

// Overwrite
export const saveOverwriteThing = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/overwrite/thing`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveOverwriteEvent = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/overwrite/event`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveOverwriteMedium = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/overwrite/medium`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

// Merge
export const saveMergeThing = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/merge/thing`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveMergeEvent = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/merge/event`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const saveMergeMedium = async (data) => {
    try {
        return await axios.post(`/api/cridb/save/merge/medium`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}


//Search
export const searchThing = async (data) => {
    try {
        return await axios.post(`/api/cridb/search/thing`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const searchEvent = async (data) => {
    try {
        return await axios.post(`/api/cridb/search/event`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const searchMedium = async (data) => {
    try {
        return await axios.post(`/api/cridb/search/medium`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}


//Get Tag IDs
export const getTagsThing = async (data) => {
    try {
        return await axios.post(`/api/cridb/tags/thing`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const getTagsEvent = async (data) => {
    try {
        return await axios.post(`/api/cridb/tags/event`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}
export const getTagsMedium = async (data) => {
    try {
        return await axios.post(`/api/cridb/tags/medium`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getDataById = async (data) => {
    try {
        return await axios.post(`/api/cridb/getdatabyid`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const deleteDataById = async (data) => {
    try {
        return await axios.post(`/api/cridb/deletedatabyid`, data);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

