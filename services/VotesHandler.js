// ../services/VotesHandler.js
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Check if user has already voted on a pin
export const hasUserVoted = async (pinId, userId) => {
  try {
    const voteRef = doc(db, "votes", `${pinId}_${userId}`);
    const voteDoc = await getDoc(voteRef);
    return voteDoc.exists() ? voteDoc.data() : null;
  } catch (error) {
    console.error("Error checking user vote:", error);
    return null;
  }
};

// Get all votes for a specific pin
export const getPinVotes = async (pinId) => {
  try {
    const votesQuery = query(
      collection(db, "votes"),
      where("pinId", "==", pinId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    
    let upvotes = 0;
    let downvotes = 0;
    
    votesSnapshot.forEach((doc) => {
      const vote = doc.data();
      if (vote.voteType === "upvote") {
        upvotes++;
      } else if (vote.voteType === "downvote") {
        downvotes++;
      }
    });
    
    return { upvotes, downvotes };
  } catch (error) {
    console.error("Error getting pin votes:", error);
    return { upvotes: 0, downvotes: 0 };
  }
};

// Auto-delete logic - check if pin should be deleted based on downvote ratio
const shouldDeletePin = (upvotes, downvotes) => {
  const totalVotes = upvotes + downvotes;
  
  // Require minimum votes to prevent deletion on too few votes
  if (totalVotes < 10) return false;
  
  const downvoteRatio = (downvotes / totalVotes) * 100;
  return downvoteRatio >= 90;
};

// Delete pin and all its associated votes
const deletePinCompletely = async (pinId) => {
  try {
    console.log(`Auto-deleting pin ${pinId} due to high downvote ratio`);
    
    // Delete the pin document
    const pinRef = doc(db, "pins", pinId);
    await deleteDoc(pinRef);
    
    // Delete all votes associated with this pin
    const votesQuery = query(
      collection(db, "votes"),
      where("pinId", "==", pinId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    
    const batch = [];
    votesSnapshot.forEach((voteDoc) => {
      batch.push(deleteDoc(voteDoc.ref));
    });
    
    // Execute all vote deletions
    await Promise.all(batch);
    
    console.log(`Successfully deleted pin ${pinId} and ${votesSnapshot.size} associated votes`);
    return true;
  } catch (error) {
    console.error("Error deleting pin:", error);
    return false;
  }
};

// Cast a vote (upvote or downvote)
export const castVote = async (pinId, userId, voteType) => {
  console.log("castVote function called with:", { pinId, userId, voteType });
  
  try {
    const voteId = `${pinId}_${userId}`;
    const voteRef = doc(db, "votes", voteId);
    const pinRef = doc(db, "pins", pinId);

    // Check if user has already voted
    const existingVote = await hasUserVoted(pinId, userId);
    console.log("Existing vote:", existingVote);

    let result;

    if (existingVote) {
      // User has already voted
      if (existingVote.voteType === voteType) {
        // Same vote type - remove vote (toggle off)
        console.log("Removing existing vote");
        await deleteDoc(voteRef);
        
        // Decrement the count in pins collection
        const decrementField = voteType === "upvote" ? "upvotes" : "downvotes";
        await updateDoc(pinRef, {
          [decrementField]: increment(-1)
        });
        
        result = { success: true, action: "removed", voteType };
      } else {
        // Different vote type - change vote
        console.log("Changing vote type");
        await setDoc(voteRef, {
          pinId,
          userId,
          voteType,
          createdAt: new Date(),
        });
        
        // Update counts: decrement old, increment new
        const oldVoteField = existingVote.voteType === "upvote" ? "upvotes" : "downvotes";
        const newVoteField = voteType === "upvote" ? "upvotes" : "downvotes";
        
        await updateDoc(pinRef, {
          [oldVoteField]: increment(-1),
          [newVoteField]: increment(1)
        });
        
        result = { success: true, action: "changed", voteType, previousVote: existingVote.voteType };
      }
    } else {
      // New vote
      console.log("Adding new vote");
      await setDoc(voteRef, {
        pinId,
        userId,
        voteType,
        createdAt: new Date(),
      });
      
      // Increment the count in pins collection
      const incrementField = voteType === "upvote" ? "upvotes" : "downvotes";
      await updateDoc(pinRef, {
        [incrementField]: increment(1)
      });
      
      result = { success: true, action: "added", voteType };
    }

    // After any vote change, check if pin should be auto-deleted
    const updatedPin = await getDoc(pinRef);
    if (updatedPin.exists()) {
      const pinData = updatedPin.data();
      const upvotes = pinData.upvotes || 0;
      const downvotes = pinData.downvotes || 0;
      
      console.log(`Pin ${pinId} vote counts - Upvotes: ${upvotes}, Downvotes: ${downvotes}`);
      
      if (shouldDeletePin(upvotes, downvotes)) {
        const deleted = await deletePinCompletely(pinId);
        if (deleted) {
          result.pinDeleted = true;
          result.deleteReason = "High downvote ratio (≥90%)";
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error casting vote:", error);
    return { success: false, error: error.message };
  }
};

// Get user's vote status for a pin
export const getUserVoteStatus = async (pinId, userId) => {
  console.log("getUserVoteStatus called with:", { pinId, userId });
  
  try {
    const existingVote = await hasUserVoted(pinId, userId);
    console.log("Vote status result:", existingVote);
    
    return {
      hasVoted: !!existingVote,
      voteType: existingVote?.voteType || null,
    };
  } catch (error) {
    console.error("Error getting user vote status:", error);
    return { hasVoted: false, voteType: null };
  }
};

// Get updated pin data with current vote counts
export const getUpdatedPinData = async (pinId) => {
  console.log("getUpdatedPinData called with:", pinId);
  
  try {
    const pinRef = doc(db, "pins", pinId);
    const pinDoc = await getDoc(pinRef);
    
    if (pinDoc.exists()) {
      const result = { id: pinDoc.id, ...pinDoc.data() };
      console.log("Updated pin data:", result);
      return result;
    }
    return null;
  } catch (error) {
    console.error("Error getting updated pin data:", error);
    return null;
  }
};

// Manual cleanup function - can be called periodically or on-demand
export const cleanupPinsWithHighDownvotes = async () => {
  try {
    console.log("Starting cleanup of pins with high downvote ratios...");
    
    const pinsSnapshot = await getDocs(collection(db, "pins"));
    let deletedCount = 0;
    
    for (const pinDoc of pinsSnapshot.docs) {
      const pinData = pinDoc.data();
      const upvotes = pinData.upvotes || 0;
      const downvotes = pinData.downvotes || 0;
      
      if (shouldDeletePin(upvotes, downvotes)) {
        const deleted = await deletePinCompletely(pinDoc.id);
        if (deleted) {
          deletedCount++;
        }
      }
    }
    
    console.log(`Cleanup complete. Deleted ${deletedCount} pins.`);
    return { success: true, deletedCount };
  } catch (error) {
    console.error("Error during cleanup:", error);
    return { success: false, error: error.message };
  }

  
};

const refreshPinsData = async () => {
  try {
    console.log("Refreshing pins from database...");
    const querySnapshot = await getDocs(collection(db, "pins"));
    const pins = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.latitude && data.longitude) {
        pins.push({
          id: doc.id,
          latitude: data.latitude,
          longitude: data.longitude,
          userId: data.userId,
          userFirstName: data.userFirstName || "anonymous",
          description: data.description,
          category: data.category || "Unknown",
          createdAt: data.createdAt,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
        });
      }
    });
    setAllPins(pins);
    console.log(`Refreshed ${pins.length} pins`);
  } catch (error) {
    console.error("Error refreshing pins:", error);
  }
};