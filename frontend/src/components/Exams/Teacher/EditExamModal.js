import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import examValidator from '../exam.validation'
import { Modal, Input, Select, DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import _ from 'underscore'
import { joiObjectParser, deepCopy, getExamStatus } from '../../../utitlities/common.functions'

const { Option } = Select

const InputWrapper = styled(Input)`
  height: 40px;
  border-radius: 5px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'none'};
`

const ColumnWrapper = styled.div`
  margin-right: 20px;
  margin-bottom: 15px;
`

const LabelWrapper = styled.p`
  margin-bottom: 5px;
  color: #608794;
`

const ErrorWrapper = styled.p`
  font-size: 11px;
  color: #d40909;
  margin-left: 5px;
`

const EditExamModal = ({
  selectedExam,
  visible,
  setVisibility,
  updateExam
}) => {
  const title = 'Edit Exam';
  const defaultExam = {
    title: '',
    examCode: '',
    department: {
      departmentCode: 'CSE',
      departmentName: 'Computer Science and Engineering'
    },
    startDate: null,
    startTime: '10:00 AM',
    duration: '00:30',
    totalMarks: 100,
    status: null
  }

  const timeFormat = 'hh:mm A'
  const durationFormat = 'HH:mm'

  const [exam, setExam] = useState(deepCopy({ ...defaultExam }))
  const [errors, setErrors] = useState({})

  const setValue = (key, value) => {
    const newExam = {
      ...exam,
      [key]: value
    }
    const newErrors = {
      ...errors
    }
    delete newErrors[key]
    setExam(newExam)
    setErrors(newErrors)
  }

  useEffect(() => {
    const newExam = {
      ...selectedExam,
      startDate: moment(selectedExam.startDate),
    };
    setExam(newExam);
  }, [selectedExam])

  const closeModal = () => {
    setVisibility(false)
    setExam(deepCopy({ ...defaultExam }))
    setErrors({})
  }

  const onSubmit = () => {
    const errors = joiObjectParser(exam, examValidator)
    setErrors(errors)
    if (!_.isEmpty(errors)) {
      return
    }
    updateExam(exam)
    closeModal()
  }

  return (
    <Modal
      title={title}
      style={{ top: 20 }}
      visible={visible}
      width={800}
      height={800}
      onOk={() => onSubmit()}
      onCancel={() => closeModal()}
      okText="Update"
    >
      <Row columns="1fr 1fr 1fr">
        <ColumnWrapper>
          <LabelWrapper>Title</LabelWrapper>
          <InputWrapper
            placeholder="Exam Title"
            value={exam.title}
            onChange={(e) => setValue('title', e.target.value)}
          />
          <ErrorWrapper> {errors.title} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Total marks</LabelWrapper>
          <InputWrapper
            placeholder="Total marks"
            value={exam.totalMarks}
            onChange={(e) => setValue('totalMarks', e.target.value)}
          />
          <ErrorWrapper> {errors.totalMarks} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Status</LabelWrapper>
          <Select
            style={{ width: '100%' }}
            placeholder="Please Provide Start date"
            disabled="true"
            value={getExamStatus(exam)}
          >
            <Option value="upcoming">Upcoming</Option>
            <Option value="running">Running</Option>
            <Option value="ended">Ended</Option>
          </Select>
          <ErrorWrapper> {errors.status} </ErrorWrapper>
        </ColumnWrapper>
      </Row>
      <Row columns="1fr 1fr 1fr">
        <ColumnWrapper>
          <LabelWrapper>Date</LabelWrapper>
          <DatePicker
            allowClear={false}
            placeholder="Start Date"
            value={!exam.startDate ? '' : moment(exam.startDate)}
            style={{ width: 270 }}
            format="DD/MM/YYYY"
            onChange={(d) => setValue('startDate', d)}
          />
          <ErrorWrapper> {errors.startDate} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Start Time</LabelWrapper>
          <TimePicker
            allowClear={false}
            value={moment(exam.startTime, timeFormat)}
            format={timeFormat}
            onSelect={(v) => setValue('startTime', v.format(timeFormat))}
          />
          <ErrorWrapper> {errors.startTime} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Duration</LabelWrapper>
          <TimePicker
            allowClear={false}
            value={moment(exam.duration, durationFormat)}
            format={durationFormat}
            onSelect={(v) => setValue('duration', v.format(durationFormat))}
          />
          <ErrorWrapper> {errors.duration} </ErrorWrapper>
        </ColumnWrapper>

      </Row>
    </Modal>
  )
}

export default EditExamModal
