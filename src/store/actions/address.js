export const ADD_ADDRESS = 'ADD_ADDRESS'
export const ACTIVATE_ADDRESS = 'ACTIVATE_ADDRESS'

export const addAddress = ( addressObj ) => {
    return { type: ADD_ADDRESS, address_type: addressObj.address_type , address: addressObj.address, icon: addressObj.icon }
}

export const activateAddress = (data) => {
    return { type: ACTIVATE_ADDRESS, data } 
}