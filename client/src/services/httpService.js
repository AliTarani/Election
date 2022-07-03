import axios from 'axios';
import { toast } from 'react-toastify';

axios.interceptors.response.use((response) => {
  if (!!response.data.success) {
    if (!!response.data.message[0]) {
      response.data.message.forEach(msg => {
        if (!!msg.alertUser)
          toast.success(msg.message, { position: toast.POSITION.BOTTOM_LEFT });
      });
    }
    else {
      toast.success(response.message.message[0].message, { position: toast.POSITION.TOP_LEFT });
    }
  }
  // console.log(response);
  return response;
}, error => {
  // console.log(error.response)
  const expectedError = error.response
    && error.response.status >= 400
    && error.response.status < 500;
  if (!!expectedError) {
    try {
      if (!!error.response.data.message[0]) {
        error.response.data.message.forEach(msg => {
          toast.error(msg.message, { position: toast.POSITION.TOP_RIGHT });
        });
      }
      else {
        toast.error(error.response.message.message[0].message, { position: toast.POSITION.TOP_LEFT });
      }
    } catch (error) {
      console.log(error)
    }

  }
  // console.log(error);

  return Promise.reject(error);

});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};