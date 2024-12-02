import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
   apiKey: "AIzaSyAR1F5wDTb8MUjLZCzOZJx6WYPPohFMeNc",
  authDomain: "modeltron-b55d3.firebaseapp.com",
  projectId: "modeltron-b55d3",
  storageBucket: "modeltron-b55d3.firebasestorage.app",
  messagingSenderId: "14873061047",
  appId: "1:14873061047:web:8d844ef9fc87f16f010f32"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

export { app, messaging };