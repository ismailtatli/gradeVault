const { getDb } = require('../db/database');

async function calculateCourseAverage(courseId) {
  const db = await getDb();

  const stmt = db.prepare(`
    SELECT weight, grade FROM assignments
    WHERE course_id = $id AND grade IS NOT NULL
  `);

  stmt.bind({ $id: courseId });

  const assignments = [];

  while (stmt.step()) {
    assignments.push(stmt.getAsObject());
  }

  stmt.free();

  if (assignments.length === 0) return null;

  const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);

  if (totalWeight === 0) return null;

  const weightedSum = assignments.reduce(
    (sum, a) => sum + a.grade * a.weight,
    0
  );

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

function letterGrade(average) {
  if (average === null) return 'N/A';

  if (average >= 85) return 'AA';
  if (average >= 75) return 'BA';
  if (average >= 70) return 'BB';
  if (average >= 65) return 'CB';
  if (average >= 55) return 'CC';
  if (average >= 50) return 'DC';
  if (average >= 40) return 'DD';
  if (average >= 30) return 'FD';

  return 'FF';
}

function gradeToGpa(average) {
  if (average === null) return null;

  if (average >= 85) return 4.0;
  if (average >= 75) return 3.5;
  if (average >= 70) return 3.0;
  if (average >= 65) return 2.5;
  if (average >= 55) return 2.0;
  if (average >= 50) return 1.5;
  if (average >= 40) return 1.0;
  if (average >= 30) return 0.5;

  return 0.0;
}

function academicStatus(average) {
  if (average === null) return 'No Grade';

  if (average < 50) return 'At Risk';
  if (average < 65) return 'Conditional Pass';

  return 'Successful';
}

async function calculateGPA(semesterFilter = null) {
  const db = await getDb();

  const courses = [];

  if (semesterFilter) {
    const stmt = db.prepare('SELECT * FROM courses WHERE semester = $s');
    stmt.bind({ $s: semesterFilter });

    while (stmt.step()) {
      courses.push(stmt.getAsObject());
    }

    stmt.free();
  } else {
    const stmt = db.prepare('SELECT * FROM courses');

    while (stmt.step()) {
      courses.push(stmt.getAsObject());
    }

    stmt.free();
  }

  if (courses.length === 0) {
    return {
      gpa: null,
      totalCredits: 0,
      details: [],
      summary: {
        successfulCourses: 0,
        conditionalCourses: 0,
        atRiskCourses: 0
      }
    };
  }

  let totalCredits = 0;
  let weightedGpaSum = 0;

  const details = [];

  for (const course of courses) {
    const avg = await calculateCourseAverage(course.id);
    const gpaPoints = gradeToGpa(avg);
    const letter = letterGrade(avg);
    const status = academicStatus(avg);

    details.push({
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      credits: course.credits,
      average: avg,
      letterGrade: letter,
      academicStatus: status,
      gpaPoints
    });

    if (gpaPoints !== null) {
      weightedGpaSum += gpaPoints * course.credits;
      totalCredits += course.credits;
    }
  }

  const gpa =
    totalCredits > 0
      ? Math.round((weightedGpaSum / totalCredits) * 100) / 100
      : null;

  const summary = {
    successfulCourses: details.filter(d => d.academicStatus === 'Successful').length,
    conditionalCourses: details.filter(d => d.academicStatus === 'Conditional Pass').length,
    atRiskCourses: details.filter(d => d.academicStatus === 'At Risk').length
  };

  return {
    gpa,
    totalCredits,
    details,
    summary
  };
}

module.exports = {
  calculateCourseAverage,
  letterGrade,
  gradeToGpa,
  academicStatus,
  calculateGPA
};