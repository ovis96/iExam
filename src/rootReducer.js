import { combineReducers } from "redux";
import loginReducer from './components/Login/reducer';
import navBarReducer from './components/NavBar/reducer';
import coursesReducer from './components/Courses/reducer'
import teacherReducer from './components/Teachers/reducer'
import studentReducer from './components/Students/reducer'
import { connectRouter } from 'connected-react-router';

const createReducers = (history) =>
  combineReducers({
    login: loginReducer,
    navBar: navBarReducer,
    courseData: coursesReducer,
    teacherData: teacherReducer,
    studentData: studentReducer,
    router: connectRouter(history),
  });
export default createReducers;