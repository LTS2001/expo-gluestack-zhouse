const fs = require('fs');

module.exports = function (api) {
  api.cache(true);

  const appEnv = process.env.APP_ENV || 'dev';
  const localEnvPath = '.env.local';
  const defaultEnvPath = `.env.${appEnv}`;
  const envPath =
    appEnv === 'dev' && fs.existsSync(localEnvPath)
      ? localEnvPath
      : defaultEnvPath;

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
        },
      ],
      'nativewind/babel',
    ],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: envPath,
        },
      ],
    ],
  };
};
