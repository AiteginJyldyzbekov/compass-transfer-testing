import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.compass.driver',
  appName: 'Compass Driver',
  webDir: 'apps/compass-driver/.next',
  server: {
    url: 'https://testingkg.su',
    cleartext: false,
  },
};

export default config;
