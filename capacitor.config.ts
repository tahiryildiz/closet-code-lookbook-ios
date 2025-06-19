
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f508a1a9bd7f4c82b7a57ca74b2517ba',
  appName: 'StyleSpace - AI Personal Stylist',
  webDir: 'dist',
  server: {
    url: 'https://f508a1a9-bd7f-4c82-b7a5-7ca74b2517ba.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
