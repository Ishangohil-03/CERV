import { USER_DETAILS } from "../actions/user"

const initialState = {
    countryCode: '',
    email:'',
    image:'',
    name:'',
    phoneNumber:'',
    postCode: '395006'
}

export default (state = initialState, action ) => {
    switch(action.type) {
        case USER_DETAILS:
            //console.log(action.data)
            const data = action.data

            return {
                ...state,
                countryCode: data.countryCode,
                email: data.email,
                image: data.image,
                name: data.name,
                phoneNumber: data.phoneNumber
            }
        default:
            return state
    }
}