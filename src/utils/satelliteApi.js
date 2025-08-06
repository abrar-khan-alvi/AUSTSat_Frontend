import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, query, orderByKey, limitToLast } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// This function is fine, no changes needed here.
export function subscribeToLatestTelemetry(callback) {
  const imageLogRef = ref(database, 'image_log');
  const latestEntryQuery = query(imageLogRef, orderByKey(), limitToLast(1));
  const unsubscribe = onValue(latestEntryQuery, (snapshot) => {
    if (snapshot.exists()) {
      let latestData = null;
      snapshot.forEach((childSnapshot) => {
        latestData = childSnapshot.val();
      });
      callback(latestData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Firebase subscription error:", error);
    callback(null);
  });
  return unsubscribe;
}

// THIS IS THE FUNCTION WITH THE FIX
export function subscribeToImageGallery(callback) {
  const galleryRef = ref(database, "image_log");

  const unsubscribe = onValue(galleryRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const imageArray = Object.values(data);

      // --- ROBUST SORTING LOGIC ---
      // This new sort function safely handles entries that are missing a timestamp.
      imageArray.sort((a, b) => {
        // If an item is missing a timestamp, treat it as "older" by pushing it to the end.
        if (!b?.capture_timestamp) return -1;
        if (!a?.capture_timestamp) return 1;
        
        // If both timestamps exist, compare them normally to sort newest first.
        return b.capture_timestamp.localeCompare(a.capture_timestamp);
      });

      callback(imageArray);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}