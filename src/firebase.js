import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAV_uDb8qlr68aA1GI75VSB3ekN0QL0XOQ",
    authDomain: "insta-app-e98ee.firebaseapp.com",
    databaseURL: "https://insta-app-e98ee.firebaseio.com",
    projectId: "insta-app-e98ee",
    storageBucket: "insta-app-e98ee.appspot.com",
    messagingSenderId: "200856092620",
    appId: "1:200856092620:web:bb54dfc39123d2cf61a769",
    measurementId: "G-QY9M81DYSE"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export   {firebase , db , auth , storage };