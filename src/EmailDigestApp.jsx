// EmailDigestApp.jsx
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyA6NKSKrejpi3LueT1YqYIOXXACOqg74GA",
  authDomain: "new-email-app-36d08.firebaseapp.com",
  projectId: "new-email-app-36d08",
  storageBucket: "new-email-app-36d08.firebasestorage.app",
  messagingSenderId: "155346970400",
  appId: "1:155346970400:web:e1590f7cf17209d4fcd945",
  measurementId: "G-0QY3EYJ5X3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const digestsRef = collection(db, "email_digests");

const EmailDigestApp = () => {
  const [user, setUser] = useState(null);
  const [digest, setDigest] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  // Simulated digest fetch for MVP
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(digestsRef, orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data().summary);
      setDigest(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">AI Gmail Summarizer</h1>
        <p className="mb-2">
          For students, freelancers, and busy professionals
        </p>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Gmail Digest</h1>
      <p className="mb-4">Welcome, {user.email}</p>

      {loading ? (
        <p>Loading your digest...</p>
      ) : digest.length > 0 ? (
        <div className="card">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              Summary of Recent Emails
            </h2>
            <p className="text-sm whitespace-pre-line">{digest[0]}</p>
          </div>
        </div>
      ) : (
        <p>No digest available. We'll generate one soon.</p>
      )}
    </div>
  );
};

export default EmailDigestApp;
