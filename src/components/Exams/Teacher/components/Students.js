import Search from 'antd/lib/input/Search'
import styled from 'styled-components'
import _ from 'underscore'
import api from '../../../../utitlities/api'
import { useEffect, useState } from 'react'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Menu } from 'antd'

const SearchStyled = styled(Search)`
  width: 100%;
  margin-bottom: 10px;
`

const Container = styled.div`
  display: grid;
  grid-template-rows: ${props => props.rows || 'auto'};
`

const HeaderLabel = styled.div`
  color: grey;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Row = styled.div`
  display: grid;
  grid-gap: 10px;
  padding: 3px;
  border-radius: 5px;
  grid-template-columns: ${props => props.columns || 'auto'};
`

const BodyRow = styled.div`
  padding: 3px;
  border-radius: 5px;
  user-select: none;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: ${props => props.columns || 'auto'};
  background: ${props => props.isSelected ? '#a3b1bd' : 'none'};
  cursor: pointer;
  :hover {
    background: ${props => props.isSelected ? '#a3b1bd' : '#e4e4e4'};
  }
`

const Body = styled.div`
  overflow: auto;
  display: flex;
  height: 100%;
  max-height: calc(100vh - 200px);
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 0px;
  }
`

const TextCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
const getName = obj => `${obj.firstName} ${obj.lastName}`
const Card = ({
  dispatch,
  student,
  totalMarks,
  exam,
  updateExamOnUI,
  showingStudentType
}) => {
  const { studentID } = useParams()
  const banStudentButtonHandler = async (e) => {
    const update = {
      $push: {
        bannedParticipants: student._id
      }
    }
    if (_.any(exam.bannedParticipants, enst => enst._id === student._id)) delete update.$push
    await api.updateExam(exam, {
      ...update,
      $pull: {
        participants: student._id
      }
    })
    await updateExamOnUI()
  }

  const unbanStudentButtonHandler = async (e) => {
    const update = {
      $push: {
        participants: student._id
      }
    }
    if (_.any(exam.participants, enst => enst._id === student._id)) delete update.$push
    await api.updateExam(exam, {
      ...update,
      $pull: {
        bannedParticipants: student._id
      }
    })
    await updateExamOnUI()
  }

  const handleMenuClick = (e) => {
    e.domEvent.stopPropagation();
    e.domEvent.preventDefault();
    switch(e.key) {
      case 'ban':
        banStudentButtonHandler();
        break;
      case 'unban':
        unbanStudentButtonHandler();
        break;
      default:
        break;
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {showingStudentType === "participants" && <Menu.Item key="ban">
        Ban
      </Menu.Item>}
      {showingStudentType === "banned" && <Menu.Item key="unban">
        Unban
      </Menu.Item>}
    </Menu>
  )

  return (
    <BodyRow isSelected={studentID === student._id} onClick={() => dispatch(push(`/exam/${exam._id}/paper/${student._id}`))} columns="repeat(2, 1fr) 80px 20px">
      <Wrapper>{student.registrationNo}</Wrapper>
      <Wrapper>{getName(student)}</Wrapper>
      <Wrapper> <TextCenter>{totalMarks || 0} </TextCenter> </Wrapper>
      <Wrapper>
        <Dropdown overlay={menu} trigger={['click']}>
          <FontAwesomeIcon
            style={{ height: '20px' }}
            onClick={(e) => e.stopPropagation()}
            icon={faEllipsisH}
            size="md"
          />
        </Dropdown>
      </Wrapper>
    </BodyRow>
  )
}

const Students = ({
  participants,
  bannedParticipants,
  exam,
  updateExamOnUI,
  dispatch,
  showingStudentType
}) => {
  const [students, setStudents] = useState([]);
  const [searchStudents, setSearchStudents] = useState([])
  useEffect(() => {
    const newStudents = showingStudentType === 'participants' ?
      participants :
      bannedParticipants;
    setStudents(newStudents);
    setSearchStudents(newStudents);
  }, [showingStudentType, participants, bannedParticipants])
  const handleSearch = (value) => {
    const pattern = value
      .trim()
      .replace(/ +/g, '')
      .toLowerCase()

    const afterSearchStudents = _.filter(students, student =>
      `${student.firstName}${student.lastName}${student.registrationNo}`
        .trim()
        .replace(/ +/g, '')
        .toLowerCase()
        .includes(pattern)
    )
    setSearchStudents(afterSearchStudents)
  }
  const [marksObj, setMarksObj] = useState({})

  useEffect(() => {
    const newMarksObj = {}
    _.each(exam.papers, paper => {
      newMarksObj[paper.student] = paper.totalMarks
    })
    setMarksObj(newMarksObj)
  }, [exam.papers])
  return (
    <Container rows="32px 32px 1fr">
      <SearchStyled
        allowClear
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Row columns="repeat(2, 1fr) 80px 20px">
        <HeaderLabel>Regi No.</HeaderLabel>
        <HeaderLabel>Name</HeaderLabel>
        <HeaderLabel><TextCenter> Total Marks </TextCenter></HeaderLabel>
        <div> </div>
      </Row>
      <Body>
        {_.map(searchStudents, (student, index) => (
          <Card
            dispatch={dispatch}
            totalMarks={marksObj[student._id]}
            key={`student_${index}`}
            student={student}
            exam={exam}
            updateExamOnUI={updateExamOnUI}
            showingStudentType={showingStudentType}
          />
        ))}
      </Body>
    </Container>
  )
}

const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(null, mapDispatchToProps)(Students)
