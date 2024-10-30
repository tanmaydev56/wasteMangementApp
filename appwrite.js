import { Client, Account, Databases } from "appwrite";

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject(
    
    import.meta.env.VITE_PUBLIC_PROJECT_ID);          // Your Appwrite Project ID

export const account = new Account(client);     // Account instance for auth
const databases = new Databases(client);        // Database instance for data access

// Replace 'databaseId' and 'collectionId' with your actual Appwrite database and collection IDs
const databaseId = import.meta.env.VTIE_PUBLIC_DATABASE_ID;
const collectionId = import.meta.env.VITE_PUBLIC_COLLECTION_ID;

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
