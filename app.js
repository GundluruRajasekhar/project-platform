const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');
const dashboardRoutes = require('./dashboard.routes');
const aiRoutes = require('./ai.routes');
const { notFound, errorHandler } = require('./errorHandler');
const dashboardRoutes = require('./routes/dashboard.routes');
const aiRoutes = require('./routes/ai.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    aiEnabled: Boolean(process.env.ANTHROPIC_API_KEY),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
