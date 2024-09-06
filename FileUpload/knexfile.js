/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
configDotenv();
// This gets the directory of the current module in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  development: {
    client: 'pg',
    connection: {
      host: 'db', 
      database: 'profieluploaddb',
      user: 'postgres',
      password: process.env.PDB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, './migrations'),
      tableName: 'knex_migrations'
    }
  },
}

export default config;
