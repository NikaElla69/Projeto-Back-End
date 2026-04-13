import app from './app';
import { pool } from './config/database/connection';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    connection.release();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

void bootstrap();
