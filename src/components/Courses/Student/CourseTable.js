
import styled from "styled-components";
import _ from 'underscore';
import { Spin, Button, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../Common/Pagination";
import React, { useState, useEffect } from "react";
import api, { deleteCourse } from "../../../utitlities/api";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { smartLabel } from "../../../utitlities/common.functions";
import { TableRow, TableRowChild, OperationWrapper, FontAwesomeIconWrapper, CenterNoData, TableHeader, TableHeaderChild, SpinWrapper } from "../../styles/tableStyles";
import { Row } from "../../styles/pageStyles";

const getName = obj => `${obj.firstName} ${obj.lastName}`;
const ButtonSyled = styled(Button)`
  margin-left: 10px;
`;

const CourseCard = ({ user, dispatch, course, updateCoursesOnUI }) => {
    const [enrollText, setEnrollText] = useState('Enroll');
    useEffect(() => {
      const enrolledIDs = _.map(course.enrolledStudents, enst => enst._id);
      const pendingEnrolledIDs = _.map(course.pendingEnrollStudents, enst => enst._id);
      let btnText = "Enroll";
      if (_.contains(enrolledIDs, user._id)) btnText = "Enrolled";
      else if (_.contains(pendingEnrolledIDs, user._id)) btnText = "Pending";
      const newStyle = { ...buttonStyle };
      switch (btnText) {
        case 'Enroll':
          newStyle.background = '#1e8efb';
          break;
        case "Enrolled":
          newStyle.background = 'rgb(71, 119, 71)';
          break;
        case "Pending":
          newStyle.background = 'rgb(111, 56, 58)';
          break;
        default:
          break;
      }
      setEnrollText(btnText);
      setButtonStyle(newStyle);
    }, [course])
    

    const isEnrollDisabled= enrollText !== 'Enroll';
    const isEnterDisabled = enrollText !== 'Enrolled';

    const [isLoading, setLoading] = useState(false);
    const [buttonStyle, setButtonStyle] = useState({ width: '84px', color: 'white'});

    const enrollRequestHandler = async (e) => {
      try {
        setLoading(true);
        await api.updateCourse(course, {
          $push: {
            pendingEnrollStudents: user._id
          }
        });
        await updateCoursesOnUI();
      } catch (err) {
    
      } finally {
        setLoading(false);
      }
    }
    
    return (
        <Row columns="repeat(5, 1fr) 240px">
            <TableRowChild> { course.title } </TableRowChild>
            <TableRowChild> { course.courseCode } </TableRowChild>
            <TableRowChild> { course.assignedTeacher ? getName(course.assignedTeacher) : 'Unassigned'} </TableRowChild>
            <TableRowChild> { course.department.departmentCode } </TableRowChild>
            <TableRowChild> { smartLabel(course.status) } </TableRowChild>
            <TableRowChild>
              <OperationWrapper>
                <ButtonSyled
                  type="primary"
                  disabled={isEnrollDisabled}
                  style={buttonStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    enrollRequestHandler();
                    // setCourseToEdit(_.create('', course));
                    // showCreateEditModal(true);
                  }}>{enrollText}</ButtonSyled>

                <ButtonSyled
                  type="primary"
                  disabled={isEnterDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(push(`/course/${course._id}`));
                    // setCourseToEdit(_.create('', course));
                    // showCreateEditModal(true);
                  }}>Enter</ButtonSyled>
            </OperationWrapper>
          </TableRowChild>
        </Row>
    )
};

const NoData = () => {
  return <CenterNoData>No Courses</CenterNoData>
};

const CourseTable = ({
  user,
  courses = [],
  isLoading,
  updateCoursesOnUI,
  dispatch
}) => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(1);
  const paginatedCourses = courses.slice((current-1)*pageSize, current*pageSize);

  useEffect(() => {
    setTotal(courses.length);
    if (!paginatedCourses.length) setCurrent(1);
  }, [courses, paginatedCourses.length]);
  const isNoData = courses.length === 0;
  return (
    <div>
      <Row columns="repeat(5, 1fr) 240px">
        <TableHeaderChild> Course Title </TableHeaderChild>
        <TableHeaderChild> Course Code </TableHeaderChild>
        <TableHeaderChild> Assigned Teacher </TableHeaderChild>
        <TableHeaderChild> Department </TableHeaderChild>
        <TableHeaderChild> Status </TableHeaderChild>
        <TableHeaderChild></TableHeaderChild>
      </Row>
      {(isNoData && !isLoading) && <NoData />}
      { !isLoading && _.map(paginatedCourses, (course, index) => (
          <CourseCard
            user={user}
            key={`courses_${index}`}
            course={course}
            deleteCourse={deleteCourse}
            dispatch={dispatch}
            updateCoursesOnUI={updateCoursesOnUI}
          />
      ))}
      { (!isLoading && !isNoData) &&
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={(page, pageSize) => {
            setCurrent(page);
            setPageSize(pageSize);
          }}
        />
      }
      { isLoading &&
        <SpinWrapper>
          <Spin size="large" />
        </SpinWrapper>
      }
    </div> 
  );
};

const mapDispatchToProps = dispatch => ({
  dispatch
});


export default connect(null, mapDispatchToProps)(CourseTable);