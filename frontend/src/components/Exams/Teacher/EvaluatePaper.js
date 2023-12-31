import CheckAuthentication from "../../CheckAuthentication/CheckAuthentication";
import NavBar from "../../NavBar/NavBar";
import { connect } from "react-redux";
import _ from "underscore";
import { BodyWrapper, Container, CenterText } from "../../../utitlities/styles";
import React, { useEffect, useState } from "react";
import api from "../../../utitlities/api";
import styled from "styled-components";
import { Button, message } from "antd";
import { getExamStatus } from "../../../utitlities/common.functions";
import { useParams } from "react-router";
import { goBack } from "connected-react-router";
import { faArrowLeft, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PageHeader,
  TileHeaderWrapper,
  RightButtonWrapper,
} from "../../styles/pageStyles";
import QuestionPaper from "./components/QuestionPaper";
import Loading from "../../Common/Loading";
import EvaluatePaperNav from "./components/EvaluatePaperNav";
import {
  BROAD,
  FILLINTHEBLANK,
  MATCHING,
  MCQ,
} from "../../../utitlities/constants";
import BroadAutoEvaluateModal from "./BroadAutoEvaluateModal";

const ButtonStyled = styled(Button)`
  height: 30px;
`;

const FontAwesomeIconWrapper = styled.div`
  width: 30px;
  display: inline-block;
  cursor: pointer;
`;

const TileBodyWrapper = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: minmax(380px, 1fr) minmax(380px, 3fr);
  height: calc(100vh - 120px);
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  margin-left: 10px;
  ${(props) => (props.loading ? "animation: rotate 2s linear infinite;" : "")}
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EvaluatePaper = ({ dispatch, user, hasBack = true }) => {
  const { examID, studentID, questionID } = useParams();
  if (!examID) return dispatch(goBack());
  if (!examID || (!studentID && !questionID)) return dispatch(goBack());
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState({});
  const [paper, setPaper] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [isLoadingAutoEvaluation, setIsLoadingAutoEvaluation] = useState(false);
  const [showBroadAutoEvaluateModal, setBroadAutoEvaluateModal] =
    useState(false);

  const updateExamOnUI = async () => {
    if (studentID === "arena") {
      setPaper({ questions: [] });
      let { payload = {} } = await api.getExamByID(examID);
      if (!payload) payload = {};
      setExam(payload);
      return;
    }
    let exam, paper;
    if (questionID) {
      // fetch papers with questionID
      const { payload = {} } = await api.getExamPaperWithQuestionID(
        examID,
        questionID
      );
      exam = payload.exam;
      paper = payload.paper;
    } else {
      const { payload = {} } = await api.getExamByIDWithPaper(
        examID,
        studentID
      );
      exam = payload.exam;
      paper = payload.paper;
    }
    const questionsObj = {};
    _.forEach(exam.questions, (q) => {
      questionsObj[q._id] = q;
    });
    if (questionID) setSelectedQuestion(questionsObj[questionID]);
    else setSelectedQuestion({});
    paper.answers = _.filter(
      paper.answers,
      (answer) => questionsObj[answer.questionID]
    );
    paper.answers = _.sortBy(
      paper.answers,
      (ele) => questionsObj[ele.questionID].title
    );
    setExam(exam);
    setPaper(paper ? { ...paper } : { answers: [] });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setIsLoading(true);
    try {
      await updateExamOnUI();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [examID, studentID, questionID]);
  const totalMarks = _.reduce(
    paper.answers,
    (sum, answer) => sum + Number(answer.marks || "0"),
    0
  );
  const submitPaperEvaluationHandler = async () => {
    setIsLoading(true);
    const totalMarks = _.reduce(
      paper.answers,
      (sum, answer) => sum + Number(answer.marks || "0"),
      0
    );

    const cleanPaper = {
      ...paper,
      totalMarks,
    };
    try {
      await api.updateExamPaperForTeacher(examID, cleanPaper);
      await updateExamOnUI();
      message.success("Submitted Successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const evaluateMatchingAnswer = (question, answer, newAnswer) => {
    const tot = question.matchingOptions.leftSide.length;
    let matched = 0;
    const answerObj = {};
    question.matchingOptions.leftSide.map((left, index) => {
      answerObj[left.id] = left.matchingID;
    });
    let parsedAnswer = [];
    try {
      parsedAnswer = JSON.parse(answer) || [];
    } catch (e) {}
    parsedAnswer.map((arr) => {
      if (answerObj[arr[0]] === arr[1]) matched++;
    });
    if (tot === matched) {
      newAnswer.marks = question.marks;
    } else {
      newAnswer.marks = 0;
    }
  };
  const autoEvaluationHandler = () => {
    setIsLoadingAutoEvaluation(true);
    setTimeout(() => {
      const newPaper = { ...paper };
      const questionsObj = {};
      _.forEach(exam.questions, (q) => {
        questionsObj[q._id] = q;
      });
      try {
        let totalMarks = 0;
        newPaper.answers = _.map(newPaper.answers, (answer) => {
          const question = questionsObj[answer.questionID];
          const newAnswer = { ...answer };
          if (!question)
            // maybe question deleted by teacher;
            newAnswer.marks = 0;
          else if (question.type !== MCQ && question.type !== MATCHING);
          else if (question.type === MATCHING) {
            // do nothing
            evaluateMatchingAnswer(question, answer.answer, newAnswer);
          } else if (question.type === MCQ) {
            if (
              answer.answer &&
              question.options[Number(answer.answer)].isAnswer
            ) {
              newAnswer.marks = question.marks;
            } else {
              newAnswer.marks = 0;
            }
          }
          totalMarks += newAnswer.marks;
          return newAnswer;
        });
        newPaper.totalMarks = totalMarks;
        setPaper(newPaper);
      } catch (err) {
        console.log(err);
      }
      setIsLoadingAutoEvaluation(false);
    }, 2000);
  };
  return (
    <div>
      <CheckAuthentication />
      {isLoading && <Loading isLoading={isLoading} />}
      <BroadAutoEvaluateModal
        visible={showBroadAutoEvaluateModal}
        setVisibility={setBroadAutoEvaluateModal}
        question={selectedQuestion}
        paper={paper}
        setPaper={setPaper}
        submitPaperEvaluation={submitPaperEvaluationHandler}
        setQuestionValue={(key, value) => {
          setSelectedQuestion({
            ...selectedQuestion,
            [key]: value,
          });
        }}
      />
      <BodyWrapper>
        <NavBar />
        <Container>
          <TileHeaderWrapper columns="1fr 1fr">
            <div>
              {hasBack && (
                <FontAwesomeIconWrapper
                  onClick={() => {
                    dispatch(goBack());
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                </FontAwesomeIconWrapper>
              )}
              <PageHeader>Exam</PageHeader>
            </div>
            <RightButtonWrapper>
              {paper.answers && paper.answers.length !== 0 && (
                <CenterText style={{ height: "30px" }}>
                  Total Marks: {totalMarks || 0}{" "}
                </CenterText>
              )}
              {(!selectedQuestion.type ||
                selectedQuestion.type === MCQ ||
                selectedQuestion.type === MATCHING) && (
                <ButtonStyled
                  disabled={isLoadingAutoEvaluation}
                  onClick={autoEvaluationHandler}
                >
                  Auto Evaluate{" "}
                  <FontAwesomeIconStyled
                    loading={isLoadingAutoEvaluation}
                    icon={faSync}
                  ></FontAwesomeIconStyled>
                </ButtonStyled>
              )}
              {(selectedQuestion.type === BROAD ||
                selectedQuestion.type === FILLINTHEBLANK) && (
                <ButtonStyled
                  disabled={isLoadingAutoEvaluation}
                  onClick={() => setBroadAutoEvaluateModal(true)}
                >
                  Auto Evaluate{" "}
                  <FontAwesomeIconStyled
                    loading={isLoadingAutoEvaluation}
                    icon={faSync}
                  ></FontAwesomeIconStyled>
                </ButtonStyled>
              )}

              <ButtonStyled
                disabled={!(paper.answers && paper.answers.length !== 0)}
                type="primary"
                onClick={submitPaperEvaluationHandler}
              >
                Submit Evaluation
              </ButtonStyled>
            </RightButtonWrapper>
          </TileHeaderWrapper>
          <TileBodyWrapper>
            <EvaluatePaperNav
              participants={exam.participants}
              exam={exam}
              updateExamOnUI={updateExamOnUI}
              questionID={questionID}
            />
            <QuestionPaper
              isLoading={isLoading}
              isLoadingAutoEvaluation={isLoadingAutoEvaluation}
              setPaper={setPaper}
              disabled={getExamStatus(exam) === "ended"}
              exam={exam}
              paper={paper}
              isQuestionSelectedNav={!!questionID}
              questions={exam.questions}
            />
          </TileBodyWrapper>
        </Container>
      </BodyWrapper>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.login.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EvaluatePaper);
