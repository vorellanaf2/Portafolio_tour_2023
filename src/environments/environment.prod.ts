import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCpGGv7ElVUtQMQyQbieWR4zhFNvCHT9Vk",
  authDomain: "tourismotest.firebaseapp.com",
  databaseURL: "https://tourismotest-default-rtdb.firebaseio.com",
  projectId: "tourismotest",
  storageBucket: "tourismotest.appspot.com",
  messagingSenderId: "252241170392",
  appId: "1:252241170392:web:88925814169b99db792cad",
  measurementId: "G-Z2BG30LYTB"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const environment = {
  production: true,
  firebaseConfig: firebaseConfig,
  firebaseApp: app, // Exporta la instancia de la aplicación Firebase
};

