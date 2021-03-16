const examHelper = require('./exam.helper');
const studentHelper = require('../student/student.helper');
const questionHelper = require('../question/question.helper');
const courseHelper = require('../course/course.helper');
const paperHelper = require('../paper/paper.helper');
const { httpStatuses } = require('../constants');
const _ = require('underscore');

// GET EXAM

exports.getExams = async (req, res) => {
  const { query } = req;
  try {
    const result = await examHelper.getExams(query);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
      .status(httpStatuses.INTERNAL_SERVER_ERROR)
      .send({ error: true, message: err.message });
  }
};
const getExamByIDWithParticipants = async (id) => {
  const result = await examHelper.getExamByID(id).lean();
  const course = await courseHelper.getCourseByID(result.course._id);
  let participants = _.filter(course.enrolledStudents, st => !_.any(result.bannedParticipants, pt => String(pt._id) === String(st._id)));
  participants = _.filter(participants, pt => _.any(result.papers, paper => String(pt._id) === String(paper.student)));
  result.participants = participants;
  result.participants.reverse();
  result.bannedParticipants.reverse();
  result.questions.reverse();
  return result;
}
exports.getExamByID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getExamByIDWithParticipants(id);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

exports.getExamByIDWithUserPaper = async (req, res) => {
  const { id } = req.params;
  const { student } = req.query;
  const isRequestFromStudent = student ? false : true;
  const studentID = student ? student : req.user._id;
  let paper = null;
  try {
    const result = await getExamByIDWithParticipants(id);
    const papers = _.filter(result.papers, paper => String(paper.student) === studentID);
    if (papers.length === 1) {
      paper = papers[0];
    } else if (papers.length > 1){
      throw new Error('Too many papers for one student!');
    } else if (isRequestFromStudent) {
      paper = await paperHelper.createPaper({
        student: studentID,
        answers: [],
        totalMarks: 0,
      });
      await examHelper.updateExamByID(id, {
        $push: {
          papers: paper._id
        }
      });
    }
    res.status(httpStatuses.OK).send({ payload: { exam: result, paper } });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

exports.getExamUsingFilterByID = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  try {
    const exams = await examHelper.getExamAggregate(id, body);
    res.status(httpStatuses.OK).send({ payload: exams[0] });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
}

// UPDATE

exports.updateExamPaperForStudent = async (req, res) => {
  const { id } = req.params;
  const { paper } = req.body;
  try {
    const dbPaper = await paperHelper.getPaperByID(paper._id);
    const queObj = {};
    _.forEach(dbPaper.answers, answer => {
      queObj[String(answer.questionID)] = 1;
    });
    await Promise.all(_.map(paper.answers, async answer => {
        if (queObj[answer.questionID]) {
          await paperHelper.updatePapers({
              _id: paper._id,
              'answers.questionID': answer.questionID,
            }, {
              'answers.$.answer': answer.answer
          });
        } else {
          await paperHelper.updatePaperByID(paper, {
            $push: {
              answers: {
                questionID: answer.questionID,
                answer: answer.answer,
                marks: 0,
              }
            }
          });
        }
      }
    ));
    res.status(httpStatuses.OK).send({ payload: {} });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

exports.updateExamPaperForTeacher = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const { paper } = req.body;
  if (req.user.userType !== 'teacher') throw new Error('User requested is not authorized!');
  try {
    await Promise.all(_.map(paper.answers, async answer =>
        paperHelper.updatePapers({
            _id: paper._id,
            'answers.questionID': answer.questionID
          }, {
            'answers.$.marks': answer.marks
        })
    ));
    await paperHelper.updatePaperByID(paper._id, { totalMarks: paper.totalMarks });
    res.status(httpStatuses.OK).send({ payload: {} });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

// CREATE EXAM
exports.createExam = async (req, res) => {
  const { exam } = req.body;
  try {
    const result = await examHelper.createExam(exam);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

// UPDATE EXAM
exports.updateExams = async (req, res) => {
  const { query, body } = req;
  try {
    const result = await examHelper.updateExams(query, body);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

exports.updateExamByID = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const result = await examHelper.updateExamByID(id, body.update);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};


// DELETE EXAM
exports.deleteExams = async (req, res) => {
  const { query } = req;
  try {
    const result = await examHelper.deleteExams(query);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};

exports.deleteExamByID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await examHelper.deleteExamByID(id);
    res.status(httpStatuses.OK).send({ payload: result });
  } catch (err) {
    console.log(err);
    res
    .status(httpStatuses.INTERNAL_SERVER_ERROR)
    .send({ error: true, message: err.message });
  }
};
