const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');

const courseRoutes = require('./src/routes/courseRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const gradeRoutes = require('./src/routes/gradeRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GradeVault API is running.'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GradeVault API running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;