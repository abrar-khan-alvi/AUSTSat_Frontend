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

// NOTE: This function is not used by the components you provided, but I've left it here.
// The original `subscribeToLatestTelemetry` is what's being used and is more efficient.
export function subscribeToLatestImageBase64(callback) {
  const imageLogRef = ref(database, "image_log");
  return onValue(imageLogRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback(null);
      return;
    }
    const validEntries = Object.values(data)
      .filter((value) => value && value.image_base64 && value.capture_timestamp);

    if (validEntries.length === 0) {
      callback(null);
      return;
    }
    // FIX: Sort by the actual timestamp string for reliability
    validEntries.sort((a, b) => b.capture_timestamp.localeCompare(a.capture_timestamp));
    
    // The latest entry is now the first one in the sorted array
    const latest = validEntries[0];
    callback(latest.image_base64);
  });
}

// This function subscribes to the single latest entry for real-time telemetry.
// It is more efficient than fetching the whole log.
export function subscribeToLatestTelemetry(callback) {
  const imageLogRef = ref(database, 'image_log');
  const latestEntryQuery = query(imageLogRef, orderByKey(), limitToLast(1));

  const unsubscribe = onValue(latestEntryQuery, (snapshot) => {
    if (snapshot.exists()) {
      let latestData = null;
      // The snapshot will only contain one child
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


// FIX: This function now correctly sorts the entire gallery in descending order.
export function subscribeToImageGallery(callback) {
  const galleryRef = ref(database, "image_log");

  return onValue(galleryRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const imageArray = Object.values(data);

      // --- ROBUST DESCENDING SORT LOGIC ---
      // This new sort function safely handles entries that might be missing a timestamp.
      imageArray.sort((a, b) => {
        // If an item is missing a timestamp, treat it as "older" by pushing it to the end.
        if (!b?.capture_timestamp) return -1;
        if (!a?.capture_timestamp) return 1;
        
        // If both timestamps exist, compare them as strings to sort newest first.
        return b.capture_timestamp.localeCompare(a.capture_timestamp);
      });

      callback(imageArray);
    } else {
      callback([]); // If there's no data, callback with an empty array
    }
  });
}