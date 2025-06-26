importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCNv23_6gEsgfJ2IBapbtEXEneFEcqSqqc",
  authDomain: "readdam-3d9c0.firebaseapp.com",
  projectId: "readdam-3d9c0",
  storageBucket: "readdam-3d9c0.firebasestorage.app",
  messagingSenderId: "552261318486",
  appId: "1:552261318486:web:09cec7786bb8d4831088f7",
  measurementId: "G-MXY3VJNG38"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('📥 백그라운드 알림 수신:', payload);

  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: icon || '/favicon.ico',
  });
});
