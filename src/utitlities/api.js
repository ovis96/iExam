import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const apiLogin = async (email, password) => {
    return axios.post(`${apiUrl}/auth/login`, { email, password });
};

export const getCourses = async (courseIDs) =>
    requestApiAndGetResponse(`${apiUrl}/courses`, 'get')
      .then(res => res.data);

export const createCourse = async (course) =>
  requestApiAndGetResponse(`${apiUrl}/courses`, 'post', { course })
    .then(res => res.data);

export const requestApiAndGetResponse = (url, method = 'get', body = {}, query = {}) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return axios({
      method,
      url,
      data: body,
      headers,
    });
}

const api = {
    apiLogin,
    getCourses,
    createCourse,
    requestApiAndGetResponse,
};

export default api;