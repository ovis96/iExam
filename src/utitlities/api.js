import axios from 'axios';
import { teachers } from './dummy';
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

export const updateCourse = async (course) =>
  requestApiAndGetResponse(`${apiUrl}/course/${course._id}`, 'put', { query: { _id: course._id }, update: course })
    .then(res => res.data);

export const deleteCourse = async (course) =>
  requestApiAndGetResponse(`${apiUrl}/course/${course._id}`, 'delete')
    .then(res => res.data);

export const getTeachers = async (teacherIDs) => {
  return { payload: teachers };
};

export const createTeacher = async (teacher) =>
requestApiAndGetResponse(`${apiUrl}/courses`, 'post', { teacher })
  .then(res => res.data);
export const updateTeacher = async (teacher) =>
  requestApiAndGetResponse(`${apiUrl}/teacher/${teacher._id || 'random'}`, 'put', { query: { _id: teacher._id }, update: teacher })
    .then(res => res.data);

export const deleteTeacher = async (teacher) =>
  requestApiAndGetResponse(`${apiUrl}/teacher/${teacher._id || 'random'}`, 'delete')
    .then(res => res.data);

export const updateDeptAdmin = async (deptAdmin) =>
  requestApiAndGetResponse(`${apiUrl}/deptAdmin/${deptAdmin._id}`, 'put', { update: deptAdmin })
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
    updateCourse,
    deleteCourse,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeachers,
};

export default api;