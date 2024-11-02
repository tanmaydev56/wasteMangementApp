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
    console.log("Rewards fetched:", response.documents);
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

export async function addReport(reportData) {
  const { amount, userid, title, description } = reportData; // Destructure fields from the reportData object
  
  try {
    const document = await databases.createDocument(
      databaseId,
      reportsCollectionId,
      "unique()",
      { 
        amount,
        userid,
        title,
        description,
        createdat: new Date().toISOString(),
      }
    );
    console.log("Report added:", document);
  } catch (error) {
    console.error("Error adding report:", error);
  }
}


export async function getReportCount() {
  try {
    const response = await databases.listDocuments(databaseId, reportsCollectionId);
    return response.total; // 'total' gives the count of documents in the collection
  } catch (error) {
    console.error("Error fetching report count:", error);
    throw error;
  }
}
export async function addReward(rewardData) {
  const { amount, rewardid, title, description } = rewardData; // Destructure fields from the rewardData object

  try {
    const document = await databases.createDocument(
      databaseId,
      rewardsCollectionId,
      "unique()",
      { 
        amount,
        rewardid,
        title,
        description,
        expirydate: new Date().toISOString(),
      }
    );
    console.log("Reward added:", document);
  } catch (error) {
    console.error("Error adding reward:", error);
  }
}


export async function getRewardBalance(userId) {
  try {
    const response = await databases.listDocuments(databaseId, rewardsCollectionId, [
      Query.equal("userid", userId) // Filter rewards by the user's ID
    ]);

    // Calculate total balance by summing the 'amount' fields
    const balance = response.documents.reduce((total, doc) => total + (doc.amount || 0), 0);

    console.log("Total reward balance:", balance);
    return balance;
  } catch (error) {
    console.error("Error fetching reward balance:", error);
    throw error;
  }
}

// Export the initialized client and databases
export { client };
