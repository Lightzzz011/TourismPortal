const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const outputPath = path.resolve(__dirname, '..', 'src', 'app', 'shared', 'app-env.ts');

const defaults = {
  APP_NAME: 'TravelX',
  SUPPORT_EMAIL: 'luckyizdone@gmail.com',
  SOCIAL_INSTAGRAM_URL: 'https://www.instagram.com/',
  SOCIAL_TWITTER_URL: 'https://x.com/',
  SOCIAL_LINKEDIN_URL: 'https://www.linkedin.com/',
  MOCK_API_PORT: '3000',
};

const parseEnv = (content) => {
  const parsed = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    parsed[key] = value;
  }
  return parsed;
};

let env = { ...defaults };
if (fs.existsSync(envPath)) {
  env = { ...env, ...parseEnv(fs.readFileSync(envPath, 'utf8')) };
}

const fileContent = `export const appEnv = {
  appName: ${JSON.stringify(env.APP_NAME)},
  supportEmail: ${JSON.stringify(env.SUPPORT_EMAIL)},
  socialLinks: {
    instagram: ${JSON.stringify(env.SOCIAL_INSTAGRAM_URL)},
    twitter: ${JSON.stringify(env.SOCIAL_TWITTER_URL)},
    linkedin: ${JSON.stringify(env.SOCIAL_LINKEDIN_URL)},
  },
  mockApiPort: ${Number(env.MOCK_API_PORT || 3000)},
} as const;
`;

fs.writeFileSync(outputPath, fileContent);
