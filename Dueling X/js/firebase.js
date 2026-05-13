// =============================================
// CONFIGURACIÓN DE FIREBASE
// =============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMY2OhAXiztHDYiPOyE2sqzuMnrRHEvuc",
  authDomain: "duelingx-3d9cc.firebaseapp.com",
  projectId: "duelingx-3d9cc",
  storageBucket: "duelingx-3d9cc.firebasestorage.app",
  messagingSenderId: "349593291676",
  appId: "1:349593291676:web:30e55abe37599ec5641659"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
