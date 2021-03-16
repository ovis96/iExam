import _ from 'underscore'
import { Spin, Button, Popconfirm } from 'antd'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../Common/Pagination'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TableRow, TableRowChild, OperationWrapper, FontAwesomeIconWrapper, TableHeader, TableHeaderChild, SpinWrapper } from '../../styles/tableStyles'
import { mapDesignations } from '../../../utitlities/constants'
import { NoDataComponent } from '../../../utitlities/common.functions'

const TeacherCard = ({ dispatch, teacher, setTeacherToEdit, showCreateEditModal, deleteTeacher }) => (
  <TableRow>
    <TableRowChild> { `${teacher.firstName} ${teacher.lastName}` } </TableRowChild>
    <TableRowChild> { mapDesignations[teacher.designation] } </TableRowChild>
    <TableRowChild> { teacher.department.departmentCode } </TableRowChild>
    <TableRowChild> { teacher.phoneNumber } </TableRowChild>
    <TableRowChild> { teacher.credential.email } </TableRowChild>
    <TableRowChild>
      <OperationWrapper>
        <Button
          onClick={() => {
            setTeacherToEdit(_.create('', teacher))
            showCreateEditModal(true)
          }}>Edit</Button>
        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteTeacher(teacher)}
        >
          <FontAwesomeIconWrapper
            icon={faTrash}
            color="#e85120"
          />
        </Popconfirm>
      </OperationWrapper>
    </TableRowChild>
  </TableRow>
)

const TeacherTable = ({
  teachers = [],
  isLoading,
  setTeacherToEdit,
  showCreateEditModal,
  deleteTeacher,
  dispatch
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    setTotal(teachers.length)
  }, [teachers])
  const paginatedTeachers = teachers.slice((current - 1) * pageSize, current * pageSize)
  const isNoData = teachers.length === 0;
  return (
    <div>
      <TableHeader>
        <TableHeaderChild> Name </TableHeaderChild>
        <TableHeaderChild> Designation </TableHeaderChild>
        <TableHeaderChild> Department </TableHeaderChild>
        <TableHeaderChild> Phone No </TableHeaderChild>
        <TableHeaderChild> Email </TableHeaderChild>
        <TableHeaderChild></TableHeaderChild>
      </TableHeader>
      {isNoData && !isLoading && <NoDataComponent title="No Teachers Added" />}
      { !isLoading && _.map(paginatedTeachers, (teacher, index) => (
        <TeacherCard
          key={`teachers_${index}`}
          teacher={teacher}
          setTeacherToEdit={setTeacherToEdit}
          showCreateEditModal={showCreateEditModal}
          deleteTeacher={deleteTeacher}
          dispatch={dispatch}
        />
      ))}
      { !isLoading && !isNoData &&
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={(page, pageSize) => {
            setCurrent(page)
            setPageSize(pageSize)
          }}
        />
      }
      { isLoading &&
        <SpinWrapper>
          <Spin size="large" />
        </SpinWrapper>
      }
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(null, mapDispatchToProps)(TeacherTable)
