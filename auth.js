// ---- Insert your Firebase config here! ----
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...rest from Firebase setup
};

// ---- End Firebase config ----

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.style.display = message ? "block" : "none";
  }
}

// Signup page logic
const signupForm = document.getElementById('signup-form');
if(signupForm){
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('signup-error', '');
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      window.location.href = 'home.html';
    } catch (err) {
      showError('signup-error', err.message);
    }
  });

  document.getElementById('google-signup').onclick = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'home.html';
    } catch (err) {
      showError('signup-error', err.message);
    }
  };
}

// Login page logic
const loginForm = document.getElementById('login-form');
if(loginForm){
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('login-error', '');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'home.html';
    } catch (err) {
      showError('login-error', err.message);
    }
  });

  document.getElementById('google-login').onclick = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'home.html';
    } catch (err) {
      showError('login-error', err.message);
    }
  };
}

// Home page logic
const logoutBtn = document.getElementById('logout-btn');
const welcomeText = document.getElementById('welcome-text');
if(logoutBtn){
  onAuthStateChanged(auth, (user) => {
    if(user){
      welcomeText.textContent = `Welcome, ${user.displayName || user.email}!`;
    } else {
      window.location.href = 'login.html';
    }
  });
  logoutBtn.onclick = async () => {
    await signOut(auth);
    window.location.href = 'login.html';
  };
}
