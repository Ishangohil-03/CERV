export const ACTIVATE_PAYMENT = 'ACTIVATE_PAYMENT';
export const GET_CARDS = 'GET_CARDS';
export const ADD_CARD = 'ADD_CARD';

export const activatePayment = (id) => {
    return { type: ACTIVATE_PAYMENT, id }
}

export const getCards = ( array ) => {
    return { type: GET_CARDS, array }
}

export const addCard = (data) => {
    return { type: ADD_CARD , data }
}