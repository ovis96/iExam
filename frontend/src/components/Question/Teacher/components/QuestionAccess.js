import Search from 'antd/lib/input/Search'
import styled from 'styled-components'
import _ from 'underscore'
import { Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { NoDataComponent } from '../../../../utitlities/common.functions'

const SearchStyled = styled(Search)`
  width: 100%;
`

const Container = styled.div`
  overflow: auto;
  height: 400px;
  padding: 20px;
  box-shadow: 1px 1px 5px #bbbbbb;
  border-radius: 5px;
  margin-bottom: 30px;
`

const HeaderLabel = styled.h3`
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Row = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: ${props => props.columns || 'auto'};
  ${props => !props.header ? 'border-bottom: 1px solid grey;' : ''}
`

const FontAwesomeIconWrapper = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin: auto;
  margin-left: 5px;
  width: 15px;
  height: 15px;
`

const getName = obj => `${obj.firstName} ${obj.lastName}`
const Card = ({ teacher, onDeleteTeacher }) => (
  <Row columns="repeat(2, 1fr) 20px">
    <Wrapper>{getName(teacher)}</Wrapper>
    <Wrapper>{teacher.department.departmentCode}</Wrapper>
    <Wrapper>
      <Popconfirm
        title="Are you sure？"
        okText="Yes"
        cancelText="No"
        onConfirm={() => onDeleteTeacher()}
      >
        <FontAwesomeIconWrapper
          icon={faTrash}
          color="#a02f2f"
        />
      </Popconfirm>
    </Wrapper>
  </Row>
)
const QuestionAccess = ({
  teachers,
  setAccessTeachers
}) => (
  <Container>
    <Row header columns="repeat(2, 1fr) 20px">
      <HeaderLabel>Name</HeaderLabel>
      <HeaderLabel>Department</HeaderLabel>
      <HeaderLabel></HeaderLabel>
    </Row>
    <hr/>
    {!teachers.length && <NoDataComponent title="Shared to none"/>}
    {_.map(teachers, (teacher, index) => (
      <Card
        key={`teacher_${index}`}
        teacher={teacher}
        onDeleteTeacher={() => {
          const nowTeachers = teachers.filter(t => t._id !== teacher._id)
          setAccessTeachers(nowTeachers)
        }}
      />
    ))}
  </Container>
)

export default QuestionAccess
