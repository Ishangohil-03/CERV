export const PLACE_ORDER = 'PLACE_ORDER'
export const SET_DATETIME = 'SET_DATETIME'
export const CANCEL_ORDER = 'CANCEL_ORDER'

export const placeOrder = (data) => {
    return { type : PLACE_ORDER, data }
}

export const setDateTime = (str) => {
    return { type : SET_DATETIME, str }
}


export const cancelOrder = (id) => {
    return { type: CANCEL_ORDER, id }
}