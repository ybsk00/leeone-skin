import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.medicalcrm.app',
    appName: 'MedicalCRM',
    webDir: 'out',
    server: {
        // CRM 환자 화면만 로드 (서브 URL)
        url: 'https://jukjeon-haniwon-ai-healthcare.vercel.app/patient',
        cleartext: false
    },
    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"]
        },
        SplashScreen: {
            launchAutoHide: false,
            backgroundColor: '#0a0f1a',
            showSpinner: true,
            spinnerColor: '#3b82f6'
        }
    },
    ios: {
        contentInset: 'automatic',
        backgroundColor: '#0a0f1a'
    },
    android: {
        allowMixedContent: false,
        backgroundColor: '#0a0f1a'
    }
};

export default config;
