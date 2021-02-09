import styled from "styled-components";
import React, { useState, useEffect } from "react";
import examValidator from '../exam.validation';
import { Modal, Input, Select, DatePicker, TimePicker } from "antd";
import moment from "moment";
import _ from "underscore";
import { joiObjectParser } from "../../../utitlities/common.functions";
import api from "../../../utitlities/api";

const { Option } = Select;

const InputWrapper = styled(Input)`
  height: 40px;
  border-radius: 5px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'none'};
`;

const ColumnWrapper = styled.div`
  margin-right: 20px;
  margin-bottom: 15px;
`;

const LabelWrapper = styled.p`
  margin-bottom: 5px;
  color: #608794;
`;

const ErrorWrapper = styled.p`
  font-size: 11px;
  color: #d40909;
  margin-left: 5px;
`;

const SelectStyled = styled(Select)`
  width: 100%;
`;
const getNameWithShort = obj => `${obj.firstName} ${obj.lastName} (${obj.shortName || ''})`;

const CreateExamModal = ({
  selectedExam,
  visible,
  setVisibility,
  courseId,
  createExam,
  updateExam
}) => {
  const isEditing = !(!selectedExam);
  const title = isEditing ? 'Edit Exam' : 'Create Exam';
  const defaultExam = {
    title: '',
    examCode: '',
    course: courseId,
    department : {
      departmentCode : "CSE",
      departmentName : "Computer Science and Engineering"
    },
    startDate: null,
    totalMarks: 100,
    endDate: moment("01/02/2021"),
    status: null 
  };
  const [exam, setExam] = useState(isEditing ? selectedExam : defaultExam);
  const [teachers, setTeachers] = useState({});
  const [errors, setErrors] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setExam(selectedExam || defaultExam);
    const { payload: fetchedTeachers = [] } = await api.getTeachers({});
    setTeachers(fetchedTeachers);
  }, [isEditing, selectedExam]);

  const setValue = (key, value) => {
    const newExam = {
      ...exam,
      [key]: value
    };
    const newErrors = {
      ...errors
    };
    delete newErrors[key];
    setExam(newExam);
    setErrors(newErrors);
  };

  const closeModal = () => {
    setVisibility(false);
    setExam(defaultExam);
    setErrors({});
  };

  const onSubmit = () => {
    const errors = joiObjectParser(exam, examValidator);
    setErrors(errors);
    if (!_.isEmpty(errors)) {
      return;
    }
    if (isEditing) updateExam(exam);
    else createExam(exam);
    closeModal();
  };

  return (
    <Modal
      title={title}
      style={{ top: 20 }}
      visible={visible}
      width={800}
      height={800}
      onOk={() => onSubmit()}
      onCancel={() => closeModal()}
      okText={!isEditing ? "Save" : "Update"}
    >
      <Row columns="1fr 1fr 1fr">
        <ColumnWrapper>
          <LabelWrapper>Title</LabelWrapper>
          <InputWrapper
            placeholder="Exam Title"
            value={exam.title}
            onChange={(e) => setValue('title', e.target.value)}
          />
          <ErrorWrapper> {errors['title']} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Total marks</LabelWrapper>
          <InputWrapper
            placeholder="Total marks"
            value={exam.totalMarks}
            onChange={(e) => setValue('totalMarks', e.target.value)}
          />
          <ErrorWrapper> {errors['totalMarks']} </ErrorWrapper>
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Status</LabelWrapper>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a status"
            value={exam.status}
            onChange={(value) => setValue('status', value)}
          >
            <Option value="upcoming">Upcoming</Option>
            <Option value="running">Running</Option>
            <Option value="ended">Ended</Option>
          </Select>
          <ErrorWrapper> {errors['status']} </ErrorWrapper>
        </ColumnWrapper>
      </Row>
      <Row columns="1fr 1fr 1fr">
        <ColumnWrapper>
          <LabelWrapper>Start Date</LabelWrapper>
          <DatePicker
            allowClear
            placeholder="Start Date"
            value={!exam.startDate ? '' : moment(exam.startDate)}
            style={{ width: 270 }}
            format="DD/MM/YYYY"
            onChange={(d) => setValue('startDate', d)}
          />
          <ErrorWrapper> {errors['startDate']} </ErrorWrapper>
          <ErrorWrapper> {errors['examCode']} </ErrorWrapper>
        </ColumnWrapper>   
        <ColumnWrapper>
          <LabelWrapper>Time</LabelWrapper>
          <TimePicker defaultValue={moment('12:08', "HH:mm")} format={"HH:mm"} />
        </ColumnWrapper>
        <ColumnWrapper>
          <LabelWrapper>Duration</LabelWrapper>
          <TimePicker defaultValue={moment('12:08', "HH:mm")} format={"HH:mm"} />
        </ColumnWrapper>
        
      </Row>
    </Modal>
  )
};

export default CreateExamModal;