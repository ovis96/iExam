import styled from "styled-components";
import _ from "underscore";
import { getExamStatus } from "../../../../utitlities/common.functions";
import { Input, Tooltip, Button } from "antd";
import { useState, useEffect } from "react";
import MCQBody from "./MCQBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../Common/Loading";
import { LabelWrapper, RightButtonWrapper } from "../../../styles/pageStyles";
import { push } from "connected-react-router";
import { Row } from "../../../../utitlities/styles";
import { connect } from "react-redux";
import FillBlankBody from "../../Common/FillBlankBody";
import {
  BROAD,
  FILLINTHEBLANK,
  MATCHING,
  MCQ,
  RUNNING,
} from "../../../../utitlities/constants";
import MatchingBody from "../../Common/MatchingBody";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  overflow: auto;
`;

const BodyWrapper = styled.div`
  overflow: auto;
  padding: 10px;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  display: inline;
`;

const AddPadding = styled.div`
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const HeaderWrapper = styled.div`
  font-weight: 600;
`;

const QuestionWrapper = styled.div`
  margin-bottom: 20px;
  border: 1px solid #e6e2e2;
  padding-top: 10px;
  padding-left: 10px;
  border-radius: 3px;
`;

const MarksWraper = styled.div`
  color: #1e961e;
`;
const BroadBodyWrapper = styled.div``;
const MCQBodyWrapper = styled.div`
  font-size: 18px;
`;
export const RadioWrapper = styled.div`
  padding: 5px;
  width: 50%;
  margin-bottom: 10px;
  border: 1px solid #b3b3b3;
`;
const InlineBlock = styled.div`
  margin-left: 10px;
  margin-bottom: 30px;
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
const BroadAnswer = styled.pre`
  border: 1px solid #888888;
  box-shadow: 0px 0px 3px 0px;
  margin: 3px;
  padding: 10px;
  font-size: 14px;
`;
const defaultQuestion = {
  matchingOptions: {
    leftSide: [],
    rightSide: [],
  },
};
const SingleQuestion = ({
  disabled,
  question = defaultQuestion,
  index,
  answer,
  exam,
  setAnswerValue,
  givenMarks,
  noMarks = false,
  isShowingEditButton,
  dispatch,
  isLoadingAutoEvaluation = false,
}) => {
  const status = getExamStatus(exam);
  const isEditing = status === RUNNING;
  const isBroad = question.type === BROAD;
  const isMCQ = question.type === MCQ;
  const isFillInTheBlank = question.type === FILLINTHEBLANK;
  const isMATCHING = question.type === MATCHING;
  const [isSingleAutoLoading, setIsSingleAutoLoading] = useState(false);
  const getMatchingAnswer = (answer = "", question) => {
    let parsedAnswer = [];
    const { leftSide, rightSide } = question.matchingOptions;
    const maxLen = Math.max(leftSide.length, rightSide.length);
    try {
      parsedAnswer = JSON.parse(answer);
    } catch (e) {}
    if (parsedAnswer.length === 0) {
      for (let i = 0; i < maxLen; i++) {
        parsedAnswer.push([
          (leftSide[i] && leftSide[i].id) || "",
          (rightSide[i] && rightSide[i].id) || "",
        ]);
      }
    }
    return JSON.stringify(parsedAnswer);
  };

  return (
    <QuestionWrapper>
      <HeaderWrapper>
        <Row columns="1fr 1fr">
          <TitleWrapper> {question.title} </TitleWrapper>
          {isShowingEditButton && (
            <RightButtonWrapper>
              <Button
                onClick={() =>
                  dispatch(push(`/exam/${exam._id}/question/${question._id}`))
                }
                style={{ marginRight: "10px" }}
              >
                Edit
              </Button>
            </RightButtonWrapper>
          )}
        </Row>

        <MarksWraper>Marks: {question.marks}</MarksWraper>
      </HeaderWrapper>
      {!isFillInTheBlank && (
        <BodyWrapper>
          <AddPadding>
            {isBroad ? (
              <BroadBodyWrapper
                dangerouslySetInnerHTML={{ __html: question.body }}
              />
            ) : (
              <MCQBodyWrapper> {question.body}</MCQBodyWrapper>
            )}
          </AddPadding>
        </BodyWrapper>
      )}

      {isMCQ && (
        <BodyWrapper>
          <AddPadding>
            <MCQBody
              showAnswer={true}
              disabled={disabled}
              answer={answer}
              options={question.options}
              setAnswerValue={(v) => setAnswerValue(index, "answer", v)}
            />
          </AddPadding>
        </BodyWrapper>
      )}
      {isBroad && (
        <BodyWrapper>
          <AddPadding>
            <LabelWrapper>Answer:</LabelWrapper>
            <BroadAnswer> {answer} </BroadAnswer>
          </AddPadding>
        </BodyWrapper>
      )}

      {isFillInTheBlank && (
        <FillBlankBody isEditing={false} question={question} answer={answer} />
      )}
      {isMATCHING && (
        <MatchingBody
          isEditing={false}
          question={question}
          answer={getMatchingAnswer(answer, question)}
          isTeacherViewing
        />
      )}

      {!noMarks && (
        <InlineBlock>
          <Input
            style={{ width: 100 }}
            value={givenMarks}
            onChange={(e) => setAnswerValue(index, "marks", e.target.value)}
            placeholder="Set Marks"
          />{" "}
          {isMCQ && (
            <Tooltip title="Evaluate">
              <FontAwesomeIconStyled
                loading={isLoadingAutoEvaluation || isSingleAutoLoading}
                style={{
                  display: "inline",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                icon={faSyncAlt}
                size="lg"
                color="green"
                onClick={() => {
                  setIsSingleAutoLoading(true);
                  setTimeout(() => {
                    if (question.options[Number(answer)].isAnswer) {
                      setAnswerValue(index, "marks", question.marks);
                    } else {
                      setAnswerValue(index, "marks", 0);
                    }
                    setIsSingleAutoLoading(false);
                  }, 1000);
                }}
              />
            </Tooltip>
          )}
        </InlineBlock>
      )}
    </QuestionWrapper>
  );
};
const NoData = styled.div`
  font-size: 24px;
  color: #9a9a9a;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const QuestionPaper = ({
  disabled = true,
  exam,
  paper,
  setPaper,
  isLoading,
  questions,
  viewQuestions = false,
  dispatch,
  isLoadingAutoEvaluation,
}) => {
  const [answers, setAnswers] = useState(paper.answers);
  const [questionsObj, setQuestionsObj] = useState({});
  useEffect(() => {
    const newQuestionsObj = {};
    _.forEach(questions, (question) => {
      newQuestionsObj[question._id] = question;
    });
    setQuestionsObj(newQuestionsObj);
  }, [questions]);

  useEffect(() => {
    setAnswers(paper.answers);
  }, [paper, paper.answers]);

  const setAnswerValue = (index, key, value) => {
    const newAnswers = [...answers];
    newAnswers[index][key] = value;
    if (key === "marks") {
      const totalMarks = _.reduce(
        paper.answers,
        (sum, answer) => sum + Number(answer.marks || "0"),
        0
      );
      setPaper({ ...paper, totalMarks });
    }
    setAnswers(newAnswers);
  };
  const didNotAnswer = "Did not answer any questions :(";
  const noQuestions = "No questions set";
  if (!isLoading && paper && paper.answers && paper.answers.length === 0) {
    return <NoData>{viewQuestions ? noQuestions : didNotAnswer}</NoData>;
  }
  if (viewQuestions)
    return (
      <Container>
        {isLoading && <Loading isLoading={isLoading} />}
        {_.map(questions, (question, index) => (
          <SingleQuestion
            disabled={disabled}
            index={index}
            setAnswerValue={() => {}}
            exam={exam}
            question={question}
            answer=""
            marks=""
            noMarks={true}
            isShowingEditButton={viewQuestions}
            dispatch={dispatch}
          />
        ))}
      </Container>
    );

  return (
    <Container>
      {isLoading && <Loading isLoading={isLoading} />}
      {_.map(answers, (answer, index) => (
        <SingleQuestion
          disabled={disabled}
          index={index}
          setAnswerValue={setAnswerValue}
          exam={exam}
          question={questionsObj[answer.questionID]}
          answer={answer.answer}
          givenMarks={answer.marks}
          dispatch={dispatch}
          isLoadingAutoEvaluation={isLoadingAutoEvaluation}
        />
      ))}
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(null, mapDispatchToProps)(QuestionPaper);
