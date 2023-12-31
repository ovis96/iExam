import CheckAuthentication from '../../CheckAuthentication/CheckAuthentication';
import NavBar from '../../NavBar/NavBar';
import { connect } from 'react-redux';
import { BodyWrapper, Container } from '../../../utitlities/styles';
import React, { useEffect, useState } from 'react';
import api from '../../../utitlities/api';
import CourseTable from './CourseTable';
import { PageHeader } from '../../styles/pageStyles';

const Courses = ({ user, dispatch }) => {
  const [isCoursesChanged, setCourseChanged] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (isCoursesChanged) {
      try {
        const { payload = [] } = await api.getCourses({})
        setCourses(payload)
      } catch (err) {
        console.log(err)
      } finally {
        setCourseChanged(false)
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCoursesChanged])

  const updateCoursesOnUI = async () => {
    setCourseChanged(true)
  }

  return (
    <div>
      <CheckAuthentication />
      <BodyWrapper>
        <NavBar />
        <Container rows="80px 1fr">
          <PageHeader>Courses</PageHeader>
          <CourseTable
            user={user}
            courses={courses}
            isLoading={isLoading}
            updateCoursesOnUI={updateCoursesOnUI}
            setIsLoading={setLoading}
          />
        </Container>
      </BodyWrapper>

    </div>
  )
}
const mapStateToProps = state => ({
  user: state.login.user,
  courses: state.courseData.courses
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Courses)
