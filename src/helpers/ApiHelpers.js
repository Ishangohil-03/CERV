import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from '../CommonConfig';

const apiBaseUrl = Constants.API_BASE_URL;

export const postPreLogin = async( url, data) => {
    return await axios
    .post( apiBaseUrl + url , data,{
        headers: {
            'Content-Type': 'application/json',
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const getPreLogin = async( url) => {
    return await axios
    .get( apiBaseUrl + url , {
        headers: {
            'Content-Type': 'application/json',
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const getWithParams = async( url) => {
    return await axios
    .get( apiBaseUrl + url , {
        headers: {
            'Content-Type': 'application/json',
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}


export const postFormDataRequest = async( url, data ) => {
    console.log("Data: ",data)
    return await axios
    .post( apiBaseUrl + url,{
        headers:{          
            'Content-Type': 'multipart/form-data',
        },
        body:data
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: '123',
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const postPostLogin = async( url, data) => {
    return await axios
    .post( apiBaseUrl + url , data,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + ( await AsyncStorage.getItem('token') )
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const deletePostLogin = async( url, data) => {
    return await axios
    .delete( apiBaseUrl + url ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + ( await AsyncStorage.getItem('token') )
        } , data
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const putPostLogin = async( url, data) => {
    return await axios
    .put( apiBaseUrl + url , data,{
        headers: {
            Authorization: 'Bearer ' + ( await AsyncStorage.getItem('token') )
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const getPostLogin = async(url) => {
    return await axios
    .get( apiBaseUrl + url, {
        headers:{
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + ( await AsyncStorage.getItem('token') )
        }
    })
    .then( (response) => {
        // console.log(response);
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
        // console.log(error);
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}

export const refreshToken = async(data) => {
    return await axios
    .post( apiBaseUrl + '/users/refresh' , data,{
        headers: {
            'Content-Type': 'application/json',
          } 
    })
    .then( (response) => {
        if(response.data.status===1) {
            return {
              success: true,
              data: response.data,
              statusCode: response.status,
            };
        } else {
            return {
              success: false,
              data: response.data,
              statusCode: response.status,
            };
        }
    })
    .catch((error) => {
          return {
            success: false,
            data: error.response.data,
            statusCode: error.response.status,
        };
    });
}