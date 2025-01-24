// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT-r43EYOGcqfbAQ2Ck_B4Hnoi-BWkZiA",
  authDomain: "yt-clone-90ac1.firebaseapp.com",
  projectId: "yt-clone-90ac1",
  appId: "1:958439590867:web:9d4a3b08fe1530e1ddbd26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
  
  /**
   * Signs the user out.
   * @returns A promise that resolves when the user is signed out.
   */
  export function signOut() {
    return auth.signOut();
  }

  /**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }