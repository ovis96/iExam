import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL

export const apiLogin = async (email, password) => axios.post(`${apiUrl}/auth/login`, {
  email,
  password
})

export const getCourses = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/courses`, 'get', {}, query)
    .then(res => res.data)

export const getQuestions = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/questions`, 'get', {}, query)
    .then(res => res.data)
  
export const getCredentials = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/credentials`, 'get', {}, query)
    .then(res => res.data)

export const getExams = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/exams`, 'get', {}, query)
    .then(res => res.data)

export const updateExam = async (exam, update) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${exam._id || 'random'}`, 'put', {
    query: {
      _id: exam._id
    },
    update: update || exam
  })
    .then(res => res.data)

export const getCourseByID = (id) =>
  requestApiAndGetResponse(`${apiUrl}/course/${id}`, 'get')
    .then(res => res.data)

export const createCourse = async (course) =>
  requestApiAndGetResponse(`${apiUrl}/courses`, 'post', {
    course
  })
    .then(res => res.data)

export const updateCourse = async (course, update) =>
  requestApiAndGetResponse(`${apiUrl}/course/${course._id}`, 'put', {
    query: {
      _id: course._id
    },
    update: update || course
  })
    .then(res => res.data)

export const deleteCourse = async (course) =>
  requestApiAndGetResponse(`${apiUrl}/course/${course._id}`, 'delete')
    .then(res => res.data)

export const getTeachers = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/teachers`, 'get', {}, query)
    .then(res => res.data)

export const getStudents = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/students`, 'get', {}, query)
    .then(res => res.data)

export const getStudentsByBatch = async (query) =>
  requestApiAndGetResponse(`${apiUrl}/students/batch`, 'get', {}, query)
    .then(res => res.data)

export const createStudent = async (student) =>
  requestApiAndGetResponse(`${apiUrl}/students`, 'post', {
    student
  })
    .then(res => res.data)

export const updateStudent = async (student) =>
  requestApiAndGetResponse(`${apiUrl}/student/${student._id || 'random'}`, 'put', {
    query: {
      _id: student._id
    },
    update: student
  })
    .then(res => res.data)

export const deleteStudent = async (student) =>
  requestApiAndGetResponse(`${apiUrl}/student/${student._id || 'random'}`, 'delete')
    .then(res => res.data)

export const createTeacher = async (teacher) =>
  requestApiAndGetResponse(`${apiUrl}/teachers`, 'post', {
    teacher
  })
    .then(res => res.data)
export const updateTeacher = async (teacher) =>
  requestApiAndGetResponse(`${apiUrl}/teacher/${teacher._id || 'random'}`, 'put', {
    query: {
      _id: teacher._id
    },
    update: teacher
  })
    .then(res => res.data)

export const deleteTeacher = async (teacher) =>
  requestApiAndGetResponse(`${apiUrl}/teacher/${teacher._id || 'random'}`, 'delete')
    .then(res => res.data)

export const createExam = async (exam) =>
  requestApiAndGetResponse(`${apiUrl}/exams`, 'post', {
    exam
  })
    .then(res => res.data)

export const updateDeptAdminByID = async (_id, body) =>
  requestApiAndGetResponse(`${apiUrl}/deptAdmin/${_id}`, 'put', {
    update: body
  })
    .then(res => res.data)

export const getUserByID = (id) =>
  requestApiAndGetResponse(`${apiUrl}/user/${id}`, 'get')
    .then(res => res.data)
export const getUsers = (query) =>
  requestApiAndGetResponse(`${apiUrl}/users`, 'get', {}, query)
    .then(res => res.data)
  
export const updateUserByID = async (_id, body) =>
  requestApiAndGetResponse(`${apiUrl}/user/${_id}`, 'put', {
    update: body
  })
    .then(res => res.data)

export const getExamByID = (id) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${id}`, 'get')
    .then(res => res.data)

export const getQuestionByID = (id) =>
  requestApiAndGetResponse(`${apiUrl}/question/${id}`, 'get')
    .then(res => res.data)

export const createQuestion = async (question) =>
  requestApiAndGetResponse(`${apiUrl}/questions`, 'post', {
    question
  })
    .then(res => res.data)

export const updateQuestion = async (question, update) =>
  requestApiAndGetResponse(`${apiUrl}/question/${question._id}`, 'put', {
    query: {
      _id: question._id
    },
    update: update || question
  })
    .then(res => res.data)

export const deleteQuestion = async (question) =>
  requestApiAndGetResponse(`${apiUrl}/question/${question._id}`, 'delete')
    .then(res => res.data)

export const requestApiAndGetResponse = (url, method = 'get', body = {}, query = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    Authorization: `Bearer ${token}`
  }
  return axios({
    method,
    url,
    params: query,
    data: body,
    headers
  })
}

export const getExamByIDWithPaper = (id, studentID) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${id}/paper${studentID ? `?student=${studentID}` : ''}`, 'get')
    .then(res => res.data)

export const updateExamPaperForStudent = (id, paper) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${id}/paper`, 'put', { paper })
    .then(res => res.data)

export const updateExamPaperForTeacher = (id, paper) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${id}/evaluatepaper`, 'put', { paper })
    .then(res => res.data)
export const getExamUsingFilterByID = (id, filter) =>
  requestApiAndGetResponse(`${apiUrl}/exam/${id}/filter`, 'post', filter)
    .then(res => res.data)

const COURSE_UPLOAD_URL = `${apiUrl}/courses/upload`;

export const uploadCoursesFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem('token');
  return axios.post(COURSE_UPLOAD_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, 
    }
  });
};

export const getClarifications = (query) =>
  requestApiAndGetResponse(`${apiUrl}/clarifications`, 'get', {}, query)
    .then(res => res.data)

export const createClarification = async (clarification) =>
  requestApiAndGetResponse(`${apiUrl}/clarifications`, 'post', {
    clarification
  })
    .then(res => res.data)
export const updateClarification = async (clarification, update) =>
  requestApiAndGetResponse(`${apiUrl}/clarification/${clarification._id}`, 'put', {
    query: {
      _id: clarification._id
    },
    update: update || clarification
  })
    .then(res => res.data)
const api = {
  apiLogin,
  getCourses,
  getQuestions,
  createCourse,
  getCourseByID,
  updateCourse,
  requestApiAndGetResponse,
  deleteCourse,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachers,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudents,
  updateDeptAdminByID,
  updateUserByID,
  getUserByID,
  getExamByID,
  getExams,
  createExam,
  updateExam,
  getCredentials,
  getStudentsByBatch,
  createQuestion,
  getQuestionByID,
  updateQuestion,
  deleteQuestion,
  getExamByIDWithPaper,
  updateExamPaperForStudent,
  updateExamPaperForTeacher,
  getExamUsingFilterByID,
  uploadCoursesFile,
  COURSE_UPLOAD_URL,
  getClarifications,
  createClarification,
  updateClarification,
  getUsers,
}

export default api
