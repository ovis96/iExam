import CheckAuthentication from "../../CheckAuthentication/CheckAuthentication";
import NavBar from "../../NavBar/NavBar";
import { connect } from "react-redux";
import _ from 'underscore';
import { BodyWrapper, Container } from "../../../utitlities/styles";
import React, { useEffect, useState } from "react";
import api from '../../../utitlities/api';
import styled from "styled-components";
import moment from 'moment';
import { Button, Input, Select, DatePicker, message } from "antd";
import { getDuration, deepCopy, getObjectByAddingID, getExamStatus } from "../../../utitlities/common.functions";
import { useParams } from "react-router";
import { goBack } from "connected-react-router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, PageHeader, TileHeaderWrapper, RightButtonWrapper, HeaderRow, LabelWrapper, BodyRow } from "../../styles/pageStyles";
import QuestionPaper from "./components/QuestionPaper";
import Loading from "../../Common/Loading";
import Participants from './components/Participants';
import ResultTable from "./components/ResultTable";
const { Option } = Select;

const InputWrapper = styled(Input)`
  && {
    width: 100%;
  }
`;

const ButtonStyled = styled(Button)`
  height: 30px;
  margin-left: 10px;
`;

const FontAwesomeIconWrapper = styled.div`
  width: 30px;
  display: inline-block;
  cursor: pointer;
`;

const SelectStyled = styled(Select)`
  width: 100%;
`;

const TileBodyWrapper = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr;
  height: calc(100vh - 120px);
  background: #f9f9f9;
`

const getNameWithShort = obj => `${obj.firstName} ${obj.lastName} (${obj.shortName || ''})`;

const ExamResult = ({ dispatch, user, hasBack = true }) => {
  
  const { examID, studentID } = useParams();
  console.log(examID, studentID);
  if (!examID) dispatch(goBack());
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState({});

  const updateExamOnUI = async () => {
      const { payload = {} } = await api.getExamByIDWithPaper(examID, studentID);
      const { exam } = payload;
      setExam(exam);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setIsLoading(true);
    try {
      await updateExamOnUI();
    } catch(err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [examID, studentID]);

  return (
    <div>
      <CheckAuthentication />
      <BodyWrapper>
        <NavBar />
        <Container>
          { isLoading && <Loading isLoading={isLoading} /> }
          <TileHeaderWrapper>
            <div>
              {hasBack &&
                <FontAwesomeIconWrapper onClick={() => {
                  dispatch(goBack());
                }}>
                  <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                </FontAwesomeIconWrapper>
              }
              <PageHeader>Exam Result</PageHeader>
            </div>
            
          </TileHeaderWrapper>
          <TileBodyWrapper>
            <ResultTable papers={exam.papers} students={exam.participants} exam={exam} isBanNotShowing/>
            
            {/* {!showingPaper && (
              <Row columns=".7fr .3fr">
                <Questions exam={exam} onShowingPaper={() => setShowingPaper(true)} questions={exam.questions}/>
                <Announcements announcements={announcements} />
              </Row>
            )} */}
          </TileBodyWrapper>
          
          
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

  
export default connect(mapStateToProps, mapDispatchToProps)(ExamResult);