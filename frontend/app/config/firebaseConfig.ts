import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgDaYDpnUVky3IKNm8JvcbTnR8KTqWOkc",
  authDomain: "recyapp-ea49e.firebaseapp.com",
  projectId: "recyapp-ea49e",
  storageBucket: "recyapp-ea49e.firebasestorage.app",
  messagingSenderId: "712807149547",
  appId: "1:712807149547:web:8c544e208c1698c8c1f3ae"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
