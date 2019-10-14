import { Pool } from 'pg';
import { stackLogger } from 'info-logger';
import { logger } from '../';

import { DATABASE_URL } from './../utils/index';

const pool: object = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('Connected successfully to database');
});

/**
 * Create Tables
 */
const createTables = async () => {
  try {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        users(
          id UUID PRIMARY KEY,
          email VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL,
          role VARCHAR(128) NOT NULL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP
        )`;

    const createTable = await pool.query(queryText);
    stackLogger(createTable);
    pool.end();
  } catch (error) {
    pool.end();
    stackLogger(error);
  }
};

/**
 * Drop Tables
 */
const dropTables = async () => {
  try {
    const queryText = 'DROP TABLE IF EXISTS reflections';

    const droppedTables = await pool.query(queryText);
    stackLogger(droppedTables);
    pool.end();
  } catch (error) {
    pool.end();
    stackLogger(error);
  }
};

const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool.query(text, params)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

pool.on('remove', () => {
  logger.info('Database client disconnected');
});

const db = {
  createTables,
  dropTables,
  query,
};

export default db;
