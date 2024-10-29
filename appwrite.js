import { Client, Account, Databases } from "appwrite";

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject('672122c90036206ecef2');          // Your Appwrite Project ID

export const account = new Account(client);     // Account instance for auth
const databases = new Databases(client);        // Database instance for data access

// Replace 'databaseId' and 'collectionId' with your actual Appwrite database and collection IDs
const databaseId = '672125ed00244b419c48';
const collectionId = '672125f7002aac463c2c';

// Function to fetch documents from the collection
async function getDocuments() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    console.log(response.documents); // This will contain your collection's documents
    return response.documents; // Optionally return the documents
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    throw error; // Re-throw error for handling elsewhere if needed
  }
}

export { client, getDocuments };
