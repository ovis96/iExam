import Search from "antd/lib/input/Search";
import styled from "styled-components";
import _ from 'underscore';
import { stFormatDate, getDuration } from "../../../utitlities/common.functions";

const SearchStyled = styled(Search)`
  width: 100%;
`;

const Container = styled.div`
  overflow: auto;
`;

const HeaderLabel = styled.div`
  color: grey;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Row = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: ${props => props.columns || 'auto'};
`;

const Card = ({ question }) => {
  return (
    <Row columns="repeat(4, 1fr)">
      <Wrapper>{question.title}</Wrapper>
      <Wrapper>{question.authorID}</Wrapper>
      <Wrapper>{question.type}</Wrapper>
      <Wrapper>{question.marks}</Wrapper>
    </Row>
  );
};

const Questions = ({
  questions
}) => {
  return (
    <Container>
      <Row columns="repeat(4, 1fr)">
        <HeaderLabel>Title</HeaderLabel>
        <HeaderLabel>Author</HeaderLabel>
        <HeaderLabel>Type</HeaderLabel>
        <HeaderLabel>Marks</HeaderLabel>
      </Row>
      {_.map(questions, question => <Card question={question} />)}
    </Container>
  );
};

export default Questions;