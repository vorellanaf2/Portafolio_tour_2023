// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig:{
    apiKey: "AIzaSyCpGGv7ElVUtQMQyQbieWR4zhFNvCHT9Vk",
    authDomain: "tourismotest.firebaseapp.com",
    projectId: "tourismotest",
    storageBucket: "tourismotest.appspot.com",
    messagingSenderId: "252241170392",
    appId: "1:252241170392:web:88925814169b99db792cad",
    measurementId: "G-Z2BG30LYTB"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);