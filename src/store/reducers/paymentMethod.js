import { ACTIVATE_PAYMENT, ADD_CARD, GET_CARDS } from "../actions/paymentMethod";

const initialState = {
    paymentMethods: [],
    activeMethodID: null
}

export default (state = initialState, action ) => {
    switch(action.type) {
        case ACTIVATE_PAYMENT:
            const id = action.id
            return {
                ...state,
                activeMethodID: id 
            }
        case ADD_CARD:
            const data = action.data
            //console.log(data);

            const cardObj = {
                brand: data.brand,
                customer: data.customer,
                exp_month: data.exp_month,
                exp_year: data.exp_year,
                id: data.id,
                last4: data.last4,
                name: data.name
            }

            const tempArray = state.paymentMethods
            tempArray.push(cardObj)
            return {
                ...state,
                paymentMethods: tempArray
            }

        default:
            return state;
    }
}