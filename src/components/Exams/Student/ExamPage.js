import CheckAuthentication from "../../CheckAuthentication/CheckAuthentication";
import NavBar from "../../NavBar/NavBar";
import { connect } from "react-redux";
import _ from 'underscore';
import { BodyWrapper, Container } from "../../../utitlities/styles";
import React, { useEffect, useState } from "react";
import api from '../../../utitlities/api';
import styled from "styled-components";
import moment from 'moment';
import { Button, Input, Select, DatePicker } from "antd";
import { getDuration } from "../../../utitlities/common.functions";
import { useParams } from "react-router";
import { goBack } from "connected-react-router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, PageHeader, TileHeaderWrapper, RightButtonWrapper, HeaderRow, LabelWrapper, BodyRow } from "../../styles/pageStyles";
import { exams, announcements, paper, questions } from "../../../utitlities/dummy";
import QuestionPaper from "./components/QuestionPaper";
import Questions from "./components/Questions";
import Announcements from "../../Courses/Student/components/Announcements";
const { Option } = Select;

const InputWrapper = styled(Input)`
  && {
    width: 100%;
  }
`;

const ButtonStyled = styled(Button)`
  height: 30px;
`;

const FontAwesomeIconWrapper = styled.div`
  width: 30px;
  display: inline-block;
  cursor: pointer;
`;

const SelectStyled = styled(Select)`
  width: 100%;
`;

const getNameWithShort = obj => `${obj.firstName} ${obj.lastName} (${obj.shortName || ''})`;

const ExamPage = ({ dispatch, user, hasBack = true }) => {
  const { id } = useParams();
  if (!id) dispatch(goBack());
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState({});
  const [teachers, setTeachers] = useState({});
  const [showingPaper, setShowingPaper] = useState(false);
  const { departmentName } = user.department || {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const { payload = {} } = await api.getExamByID(id);
      const { payload: fetchedTeachers = [] } = await api.getTeachers({});
      setExam(payload);
      setTeachers(fetchedTeachers);
    } catch(err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const setValue = (key, value) => {
    const newExam = {
      ...exam,
      [key]: value
    };
    setExam(newExam);
  };

  return (
    <div>
      <CheckAuthentication />
      <BodyWrapper>
        <NavBar />
        <Container>
          <TileHeaderWrapper>
            <div>
              {hasBack &&
                <FontAwesomeIconWrapper onClick={() => {
                  if (showingPaper) setShowingPaper(false);
                  else dispatch(goBack());
                }}>
                  <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                </FontAwesomeIconWrapper>
              }
              <PageHeader>Exam</PageHeader>
            </div>
          </TileHeaderWrapper>
          {showingPaper && (
            <div>
              <QuestionPaper paper={paper}/>
            </div>
          )}
          {!showingPaper && (
            <Row columns=".7fr .3fr">
              <Questions onShowingPaper={() => setShowingPaper(true)} questions={questions}/>
              <Announcements announcements={announcements} />
            </Row>
          )}
          
        </Container>
      </BodyWrapper>
    </div>
  );
};
const mapStateToProps = state => ({
  user: state.login.user
});

const mapDispatchToProps = dispatch => ({
    dispatch
});

  
export default connect(mapStateToProps, mapDispatchToProps)(ExamPage);