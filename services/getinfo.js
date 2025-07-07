import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Fetch user info by username (or use user ID/email as needed)
export async function getUserInfo(username) {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Return the first matching user
    return querySnapshot.docs[0].data();
  }
  return null;
}