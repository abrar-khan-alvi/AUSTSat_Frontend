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

// Subscribe to latest image updates
export function subscribeToLatestImageBase64(callback) {
  const imageLogRef = ref(database, "image_log");
  return onValue(imageLogRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback(null);
      return;
    }
    const validEntries = Object.entries(data)
      .filter(([_, value]) => value && value.image_base64);
    if (validEntries.length === 0) {
      callback(null);
      return;
    }
    validEntries.sort(([a], [b]) => a.localeCompare(b));
    const latest = validEntries[validEntries.length - 1][1];
    callback(latest.image_base64);
  });
}

// It subscribes to the entire image gallery.
export function subscribeToImageGallery(callback) {
  const galleryRef = ref(database, "image_log");

  return onValue(galleryRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert the Firebase object into an array of image objects
      const imageArray = Object.values(data);

      // Sort the array to show the newest images first
      imageArray.sort((a, b) => b.timestamp - a.timestamp);

      // Pass the sorted array to the callback function
      callback(imageArray);
    } else {
      // If there are no images, return an empty array
      callback([]);
    }
  });
}