export const hasPageAccess = {
  deptAdmin: {
    Courses: true,
    Teachers: true,
    Students: true,
    CoursePage: true,
    ExamPage: true
  },
  student: {
    Exams: true,
    Courses: true,
    Results: true,
  },
  teacher: {
    Exams: true,
    Courses: true,
    Questions: true,
  }
}

export const ignoreKeys = {
  updatedAt: true,
  createdAt: true,
  __v: true,
  department: true
}
export const timeFormat = 'hh:mm A'
export const durationFormat = 'HH:mm'

export const mapDesignations = {
  "guest-lecturer": 'Guest Lecturer',
  "lecturer": 'Lecturer',
  "assistant-professor": 'Assistant Professor',
  "associate-professor": 'Associate Professor',
  "professor": 'Professor',
};

export const sortArrayByMap = {
  random: (array) => {
    if (!array) return array;
    const n = array.length;
    const newArray = [];
    if (!n) return array;
    const set = new Set();
    while (set.size < array.length) {
      const i = Math.floor(Math.random()*100000) % n;
      if (set.has(i)) continue;
      set.add(i);
      newArray.push(array[i]);
    }
    return newArray;
  },
  marksASC: (array, obj) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = obj[ansA.questionID].marks;
      const b = obj[ansB.questionID].marks;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    return newArray;
  },
  marksDESC: (array, obj) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = obj[ansA.questionID].marks;
      const b = obj[ansB.questionID].marks;
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    })
    return newArray;
  },
  mcqFirst: (array, obj) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = obj[ansA.questionID].type.toLowerCase() === "mcq";
      const b = obj[ansB.questionID].type.toLowerCase() === "mcq";
      if (a && !b) return -1;
      if (!a && b) return 1;
      return 0;
    })
    return newArray;
  },
  questionTitle: (array, obj) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = obj[ansA.questionID].title.toLowerCase();
      const b = obj[ansB.questionID].title.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    return newArray;
  },
  unAnsweredFirst: (array) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = ansA.answer;
      const b = ansB.answer;
      if (!a && b) return -1;
      if (a && !b) return 1;
      return 0;
    })
    return newArray;
  },
  answeredFirst: (array) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort((ansA, ansB) => {
      const a = ansA.answer;
      const b = ansB.answer;
      if (a && !b) return -1;
      if (!a && b) return 1;
      return 0;
    })
    return newArray;
  },
}