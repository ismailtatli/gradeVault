const { getDb } = require('../db/database');

function calculateCourseAverage(courseId) {
  const db = getDb();
  const assignments = db.prepare(`
    SELECT weight, grade FROM assignments
    WHERE course_id = ? AND grade IS NOT NULL
  `).all(courseId);
  if (assignments.length === 0) return null;
  const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
  if (totalWeight === 0) return null;
  const weightedSum = assignments.reduce((sum, a) => sum + (a.grade * a.weight), 0);
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

function letterGrade(average) {
  if (average === null) return 'N/A';
  if (average >= 90) return 'AA';
  if (average >= 85) return 'BA';
  if (average >= 80) return 'BB';
  if (average >= 75) return 'CB';
  if (average >= 70) return 'CC';
  if (average >= 65) return 'DC';
  if (average >= 60) return 'DD';
  return 'FF';
}

function gradeToGpa(average) {
  if (average === null) return null;
  if (average >= 90) return 4.0;
  if (average >= 85) return 3.5;
  if (average >= 80) return 3.0;
  if (average >= 75) return 2.5;
  if (average >= 70) return 2.0;
  if (average >= 65) return 1.5;
  if (average >= 60) return 1.0;
  return 0.0;
}

function calculateGPA(semesterFilter = null) {
  const db = getDb();
  const courses = semesterFilter
    ? db.prepare('SELECT * FROM courses WHERE semester = ?').all(semesterFilter)
    : db.prepare('SELECT * FROM courses').all();
  if (courses.length === 0) return { gpa: null, totalCredits: 0, details: [] };
  let totalCredits = 0;
  let weightedGpaSum = 0;
  const details = [];
  for (const course of courses) {
    const avg = calculateCourseAverage(course.id);
    const gpaPoints = gradeToGpa(avg);
    const letter = letterGrade(avg);
    details.push({
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      credits: course.credits,
      average: avg,
      letterGrade: letter,
      gpaPoints
    });
    if (gpaPoints !== null) {
      weightedGpaSum += gpaPoints * course.credits;
      totalCredits += course.credits;
    }
  }
  const gpa = totalCredits > 0
    ? Math.round((weightedGpaSum / totalCredits) * 100) / 100
    : null;
  return { gpa, totalCredits, details };
}

module.exports = { calculateCourseAverage, letterGrade, gradeToGpa, calculateGPA };