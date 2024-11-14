import {mongoose} from "mongoose";

// Define the schema for the bounty ID table
const bountyIdTableSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: String, // Defines each value in the map as a string
    required: true,
  },
});

// Define the model directly within this file
const BountyIdTable = mongoose.model("BountyIdTable", bountyIdTableSchema);

function sanitizeKey(url) {
    return url.replace(/[.#$/\[\]:]/g, "_"); // Replace each special character with an underscore
}

/**
 * Retrieves the bounty ID associated with a specific key.
 * @param {string} key - The key for which to retrieve the bounty ID.
 * @returns {Promise<string|null>} - The bounty ID associated with the key, or null if not found.
 */
export const getBountyId = async (key) => {
  try {
    // Find the first document in the collection (assuming there's only one document for the map)
    const bountyTable = await BountyIdTable.findOne();
    
    // Check if the key exists in the map and retrieve it
    const bountyId = bountyTable?.data.get(sanitizeKey(key)) || null;

    return bountyId;
  } catch (error) {
    console.error("Error retrieving bounty ID:", error);
    return null;
  }
};

/**
 * Sets the bounty ID associated with a specific key.
 * @param {string} key - The key for which to set the bounty ID.
 * @param {string} bountyId - The bounty ID to store.
 * @returns {Promise<void>}
 */
export const setBountyId = async (key, bountyId) => {
    try {
      // Find the first document in the collection or create a new one if none exists
      let bountyTable = await BountyIdTable.findOne();
  
      if (!bountyTable) {
        // If no document exists, create a new one
        bountyTable = new BountyIdTable({ data: {} });
      }
      
      // Set or update the bounty ID for the given key
      bountyTable.data.set(sanitizeKey(key), bountyId);
  
      // Save the changes to the database
      await bountyTable.save();
      // console.log(`Bounty ID set for key: ${key}`);
    } catch (error) {
      console.error("Error setting bounty ID:", error);
    }
  };
  
