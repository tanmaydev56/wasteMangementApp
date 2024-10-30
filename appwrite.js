import { Client, Account, Databases, Query } from "appwrite";

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite Cloud endpoint
  .setProject(import.meta.env.VITE_PUBLIC_PROJECT_ID); // Project ID from .env

// Exporting instances for authentication and database access
export const account = new Account(client);
export const databases = new Databases(client);

// Database and collection IDs from .env or defined directly here
const databaseId = import.meta.env.VITE_PUBLIC_DATABASE_ID;
const reportsCollectionId = "672284a20031de80517d"; // Replace with actual ID
const rewardsCollectionId = "672284ae0018331a31f3"; // Replace with actual ID
const tasksCollectionId = "672284be0021c05c8322"; // Replace with actual ID

// Function to fetch recent reports
export async function getRecentReports(limit = 100) {
  try {
    const response = await databases.listDocuments(databaseId, reportsCollectionId, [
      Query.limit(limit),
      Query.orderDesc('$createdAt')
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

// Function to fetch all rewards
export async function getAllRewards() {
  try {
    const response = await databases.listDocuments(databaseId, rewardsCollectionId);
    return response.documents;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
}

// Function to fetch waste collection tasks
export async function getWasteCollectionTasks(limit = 100) {
  try {
    const response = await databases.listDocuments(databaseId, tasksCollectionId, [
      Query.limit(limit),
      Query.orderDesc('$createdAt')
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

// Function to add a report
export async function addReport(amount, userid) {
  try {
    const document = await databases.createDocument(
      databaseId,
      reportsCollectionId,
      "unique()", // Use a unique ID for the document
      { 
        amount: amount,
        userid: userid,
        createdat: new Date().toISOString(),
      }
    );
    console.log("Report added:", document);
  } catch (error) {
    console.error("Error adding report:", error);
  }
}

// Function to add a reward
export async function addReward(amount, rewardid) {
  try {
    const document = await databases.createDocument(
      databaseId,
      rewardsCollectionId,
      "unique()", // Use a unique ID for the document
      { 
        amount: amount,
        rewardid: rewardid,
        expirydate: new Date().toISOString(),
      }
    );
    console.log("Reward added:", document);
  } catch (error) {
    console.error("Error adding reward:", error);
  }
}

// Export the initialized client and databases
export { client };
