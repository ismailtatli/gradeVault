const express = require('express');
const router = express.Router();
const { calculateGPA, calculateCourseAverage, letterGrade } = require('../services/gradeService');

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: GPA and grade calculations
 */

/**
 * @swagger
 * /api/grades/gpa:
 *   get:
 *     summary: Calculate overall GPA
 *     tags: [Grades]
 *     parameters:
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *         description: Filter by semester
 *     responses:
 *       200:
 *         description: GPA details
 */
router.get('/gpa', (req, res) => {
  const { semester } = req.query;
  const result = calculateGPA(semester || null);
  res.json({ success: true, data: result });
});

/**
 * @swagger
 * /api/grades/course/{courseId}:
 *   get:
 *     summary: Get grade summary for a course
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade summary
 */
router.get('/course/:courseId', (req, res) => {
  const avg = calculateCourseAverage(Number(req.params.courseId));
  res.json({ success: true, data: { average: avg, letterGrade: letterGrade(avg) } });
});

module.exports = router;