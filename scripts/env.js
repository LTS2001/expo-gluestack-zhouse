import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const appEnv = process.env.APP_ENV || 'dev';
const localEnvPath = '.env.local';
const defaultEnvPath = `.env.${appEnv}`;
const envPath =
  appEnv === 'dev' && fs.existsSync(localEnvPath)
    ? localEnvPath
    : defaultEnvPath;

// based on .env.dev file
const ENV_FILE = path.resolve(process.cwd(), envPath);

if (!fs.existsSync(ENV_FILE)) {
  console.error(`❌ ${ENV_FILE} not exists`);
  process.exit(1);
}

const envConfig = dotenv.config({ path: ENV_FILE }).parsed;

console.log(
  '🤖 scripts/env.js -> the currently injected APP_ENV process variable is',
  process.env.APP_ENV,
);
console.log('🤖 scripts/env.js -> contents json output is', envConfig);

export default envConfig;
