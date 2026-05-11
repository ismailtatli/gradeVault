const express = require('express');
const router = express.Router();
const {
  getAllCourses, getCourseById,
  createCourse, updateCourse, deleteCourse
} = require('../services/courseService');
const { calculateCourseAverage, letterGrade } = require('../services/gradeService');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, code or instructor
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', (req, res) => {
  const { search } = req.query;
  const courses = getAllCourses(search);
  const enriched = courses.map(c => {
    const avg = calculateCourseAverage(c.id);
    return { ...c, average: avg, letterGrade: letterGrade(avg) };
  });
  res.json({ success: true, data: enriched });
});

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Not found
 */
router.get('/:id', (req, res) => {
  const course = getCourseById(Number(req.params.id));
  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
  const avg = calculateCourseAverage(course.id);
  res.json({ success: true, data: { ...course, average: avg, letterGrade: letterGrade(avg) } });
});

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, credits, semester]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               credits:
 *                 type: integer
 *               semester:
 *                 type: string
 *               instructor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Validation error
 */
router.post('/', (req, res) => {
  const result = createCourse(req.body);
  if (!result.success) return res.status(400).json({ success: false, errors: result.errors });
  res.status(201).json({ success: true, id: result.id });
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.put('/:id', (req, res) => {
  const result = updateCourse(Number(req.params.id), req.body);
  if (!result.success) {
    const status = result.errors[0] === 'Course not found.' ? 404 : 400;
    return res.status(status).json({ success: false, errors: result.errors });
  }
  res.json({ success: true });
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', (req, res) => {
  const result = deleteCourse(Number(req.params.id));
  if (!result.success) return res.status(404).json({ success: false, errors: result.errors });
  res.json({ success: true });
});

module.exports = router;