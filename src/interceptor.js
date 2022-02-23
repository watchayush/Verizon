import axios from 'axios';
import { fetchAccessTokenUsingRefreshToken } from './auth/authAPI';
import ErrorCodes from './errorCodes';
import { addModal } from './modal/modalSlice';
import { addToaster } from './toaster/toasterSlice';

let retryCount = 0;
const maxCount = 2;

const handleErrorResponse = async (error, store) => {
  const originalRequest = error.config;
  /** Handle 404 */
  if (error?.response?.status === 401) {
    //Retry Logic ( Maximum retry = 1)
    if (retryCount <= maxCount) {
      retryCount++;
      try {
        const token = await fetchAccessTokenUsingRefreshToken();
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        retryCount--;
        return axiosInstance(originalRequest);
      } catch (error) {
        if (retryCount === maxCount) {
          store.dispatch({ type: 'auth/invalidate', payload: { error: 'test Error', data: false } });
        }
      }
    }
  } else {
    const payload = {
      title: 'Error',
      body: '',
      actions: [{ title: 'Cancel', type: 'primary' }],
    };
    let errorMsg = ErrorCodes[error?.response?.status || '404'];
    payload.body = error?.response?.message || errorMsg;
    store.dispatch(addModal(payload));
  }
};

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_BASE_URL,
  timeout: 1000 * 60,
  headers: { 'Content-Type': 'application/json' },
});

const Interceptor = (store) => {
  const ALLOWED_DOMAIN = 'auth/authenticate';
  // const dispatch = useDispatch();
  //Request interceptor
  axiosInstance.interceptors.request.use(
    function (config) {
      // TEMP:
      const _userId = localStorage.getItem('userId');
      config.headers.uid = _userId;

      if (config.url.indexOf(ALLOWED_DOMAIN) === -1) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          throw Error('Access token not found');
        }
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    function (response) {
      if (response?.errorDetails) {
        const errorMsg = response?.errorDetails?.errorMessage || 'Error';
        store.dispatch(addToaster({ text: errorMsg, type: 'error' }));
      }
      return response;
    },
    async function (error) {
      handleErrorResponse(error, store);
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    },
  );
};

export default Interceptor;