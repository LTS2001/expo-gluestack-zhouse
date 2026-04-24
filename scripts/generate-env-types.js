const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// based on .env.dev file
const ENV_FILE = path.resolve(process.cwd(), '.env.dev');
const OUTPUT_FILE = path.resolve(process.cwd(), 'env.d.ts');

if (!fs.existsSync(ENV_FILE)) {
  console.error(`❌ ${ENV_FILE} not exists`);
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));

const keys = Object.keys(envConfig);

const lines = keys.map((key) => {
  return `  export const ${key}: string;`;
});

const content = `declare module '@env' {
${lines.join('\n')}
}
`;

fs.writeFileSync(OUTPUT_FILE, content);

console.log('✅ env.d.ts generated');
