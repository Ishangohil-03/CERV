export const ADD_DETAILS = 'ADD_DETAILS'
export const ADD_PHONE = 'ADD_PHONE'
export const SET_ROLE = 'SET_ROLE'
export const ADD_IMAGE ='ADD_IMAGE'

export const addDetails = (data) => {
    return { type: ADD_DETAILS, data }
}

export const addPhone = (data) => {
    return { type: ADD_PHONE, data } 
}

// 0- CATERER & 1- CUSTOMER
export const setUserRole = (n) => {
    return { type: SET_ROLE , role: n}
}

export const addImage = (dataObj) => {
    return { type: ADD_IMAGE, dataObj }
}
 