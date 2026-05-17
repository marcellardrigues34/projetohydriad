
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyALEPxNHQjjTJyba9sKCAKQ6RUDBYech98",
  authDomain: "projetohydriad.firebaseapp.com",
  projectId: "projetohydriad",
  storageBucket: "projetohydriad.firebasestorage.app",
  messagingSenderId: "98232224769",
  appId: "1:98232224769:web:e0251d80096e40b2b18400",
  databaseURL: "https://projetohydriad-default-rtdb.firebaseio.com/"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const database = getDatabase(app);
export const db = getDatabase();
