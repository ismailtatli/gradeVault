const express = require('express');

const {
  registerStudent,
  loginStudent,
  getDefaultProfile
} = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const result = await registerStudent(req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

router.post('/login', async (req, res) => {
  const result = await loginStudent(req.body);

  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
});

router.get('/profile', async (req, res) => {
  const result = await getDefaultProfile();

  return res.status(200).json(result);
});

module.exports = router;