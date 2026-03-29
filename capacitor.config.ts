import type { CapacitorConfig } from '@capacitor/cli';

const isProd = process.env.CAP_ENV === 'production';
const serverUrl = isProd
  ? process.env.CAP_SERVER_URL
  : process.env.CAP_SERVER_URL ?? 'http://localhost:3000';

const config: CapacitorConfig = {
  appId: 'com.easyleaderboard.app',
  appName: 'Easy Leaderboard',
  webDir: 'www',
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: !isProd
      }
    : undefined,
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
