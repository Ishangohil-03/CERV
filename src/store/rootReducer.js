import { combineReducers } from 'redux';


import cartReducer from './reducers/cart';
import addressReducer from './reducers/address';
import authReducer from './reducers/auth';
import registerReducer from './reducers/register';
import paymentReducer from './reducers/paymentMethod';
import orderReducer from './reducers/order';
import userReducer from './reducers/user';

export const rootReducer = combineReducers({
    Cart: cartReducer,
    Address: addressReducer,
    Auth: authReducer,
    Register: registerReducer,
    Payment: paymentReducer,
    Order: orderReducer,
    User: userReducer
})