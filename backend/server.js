require('./src/config/env'); 

const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const { port } = require('./src/config/env');

const startServer = async () => {
  try {
    await testConnection();

    app.listen(port, () => {
      console.log(` Server running on http://localhost:${port}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
