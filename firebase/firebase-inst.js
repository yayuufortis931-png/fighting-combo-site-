// firebase/firebase-init.js
// Firebase 初期化
const firebaseConfig = {
  apiKey: "AIzaSyAD4fyc-1VlEEGGO631hhpZqCOqllrQ3og",
  authDomain: "st6-combo-maker.firebaseapp.com",
  projectId: "st6-combo-maker",
  storageBucket: "st6-combo-maker.firebasestorage.app",
  messagingSenderId: "945906359459",
  appId: "1:945906359459:web:59a955b609426cf2893316",
  measurementId: "G-YVFY7H6N9E"
};

// 初期化
firebase.initializeApp(firebaseConfig);

// Firestore 参照用
const db = firebase.firestore();
