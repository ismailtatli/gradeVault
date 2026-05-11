const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAssignmentsByCourse, getAssignmentById, createAssignment, updateAssignment, deleteAssignment } = require('../services/assignmentService');

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management per course
 */

/**
 * @swagger
 * /api/courses/{courseId}/assignments:
 *   get:
 *     summary: Get all assignments for a course
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get('/', async (req, res) => {
  try {
    const assignments = await getAssignmentsByCourse(Number(req.params.courseId));
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/courses/{courseId}/assignments/{id}:
 *   get:
 *     summary: Get a single assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Found
 *       404:
 *         description: Not found
 */
router.get('/:id', async (req, res) => {
  try {
    const a = await getAssignmentById(Number(req.params.id));
    if (!a) return res.status(404).json({ success: false, message: 'Assignment not found.' });
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/courses/{courseId}/assignments:
 *   post:
 *     summary: Create an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, weight]
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [exam, assignment, quiz, project]
 *               weight:
 *                 type: number
 *               grade:
 *                 type: number
 *               due_date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const result = await createAssignment(Number(req.params.courseId), req.body);
    if (!result.success) return res.status(400).json({ success: false, errors: result.errors });
    res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/courses/{courseId}/assignments/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
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
router.put('/:id', async (req, res) => {
  try {
    const result = await updateAssignment(Number(req.params.id), req.body);
    if (!result.success) {
      const status = result.errors[0] === 'Assignment not found.' ? 404 : 400;
      return res.status(status).json({ success: false, errors: result.errors });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/courses/{courseId}/assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
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
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteAssignment(Number(req.params.id));
    if (!result.success) return res.status(404).json({ success: false, errors: result.errors });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;