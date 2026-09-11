const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { clientUrl, nodeEnv } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const adminDashboardRoutes = require('./modules/admin/admin.routes');
const adminUsersRoutes = require('./modules/users/users.routes');
const { adminRouter: adminStoresRoutes, userRouter: storesRoutes } = require('./modules/stores/stores.routes');
const ratingsRoutes = require('./modules/ratings/ratings.routes');
const ownerRoutes = require('./modules/owner/owner.routes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'development' ? 'dev' : 'combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Store Rating API is running',
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminDashboardRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/stores', adminStoresRoutes);



app.use('/api/stores', storesRoutes);
app.use('/api/ratings', ratingsRoutes);



app.use('/api/owner', ownerRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


app.use(errorHandler);

module.exports = app;
