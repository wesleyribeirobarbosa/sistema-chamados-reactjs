import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

let firebaseConfig = {
  apiKey: "AIzaSyCRjT6IpC4jM8aiHOFy3EgwsVy0A-E6xDQ",
  authDomain: "sistema-chamados-22dc2.firebaseapp.com",
  projectId: "sistema-chamados-22dc2",
  storageBucket: "sistema-chamados-22dc2.appspot.com",
  messagingSenderId: "129160299612",
  appId: "1:129160299612:web:b732bcf6b4307d1a3f1299",
  measurementId: "G-331LMRDMXP",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
