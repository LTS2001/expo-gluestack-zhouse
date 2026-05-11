const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const appEnv = process.env.APP_ENV || 'dev';
const localEnvPath = '.env.local';
const defaultEnvPath = `.env.${appEnv}`;
const envPath =
  appEnv === 'dev' && fs.existsSync(localEnvPath)
    ? localEnvPath
    : defaultEnvPath;

// based on .env.dev file
const ENV_FILE = path.resolve(process.cwd(), envPath);
const OUTPUT_DIR = path.resolve(process.cwd(), 'configs');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'env.ts');

if (!fs.existsSync(ENV_FILE)) {
  console.error(`❌ ${ENV_FILE} not exists`);
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));

console.log(
  '🤖 configs/env.ts -> the currently injected APP_ENV process variable is',
  process.env.APP_ENV,
);
console.log('🤖 configs/env.ts -> contents json output is', envConfig);

const keys = Object.keys(envConfig);

const lines = keys.map((key) => {
  return `export const ${key} = "${envConfig[key]}";`;
});

const content = `${lines.join('\n')}`;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_FILE, content);

console.log('✅ configs/env.ts generated');
