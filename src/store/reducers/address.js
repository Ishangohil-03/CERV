import { ADD_ADDRESS, ACTIVATE_ADDRESS } from "../actions/address";

const initialState = {
    addresses: [],
    activeAddress: {}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_ADDRESS:
            const address_type = action.address_type;
            const address = action.address;
            const icon = action.icon;

            let newAddress;
            newAddress = { address_type,address,icon }
            const addressList = [];
            for( const key in state.addresses ) {
                addressList.push({
                    ...state.addresses[key]
                });
            }
            addressList.push(newAddress);

            let newAddressList = addressList.map( (object,index) => ({ ...object, id: index }))
            return {
                ...state,
                addresses: {...newAddressList}
            }

        case ACTIVATE_ADDRESS:
            const activeAddress = action.data;
            
            return{
                ...state,
                activeAddress: activeAddress
            }
        default:
            return state
    }
}