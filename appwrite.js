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
const reportsCollectionId = import.meta.env.VITE_PUBLIC_REPORTS_COLLECTION_ID; 
const rewardsCollectionId = import.meta.env.VITE_PUBLIC_REWARDS_COLLECTION_ID; 
const tasksCollectionId = import.meta.env.VITE_PUBLIC_TASKS_COLLECTION_ID; 
const usersCollectionId = import.meta.env.VITE_PUBLIC_USERINFO_COLLECTION_ID;

// Function to fetch user document by email
export async function fetchUserDocumentByEmail(email) {
  try {
    const response = await databases.listDocuments(databaseId, usersCollectionId, [
      Query.equal("email", email) // Adjust "email" to your attribute name
    ]);

    if (response.total > 0) {
      // Get the document ID from the first result
      const documentId = response.documents[0].$id;
      return documentId;
    } else {
      throw new Error("User document not found");
    }
  } catch (error) {
    console.error("Error fetching user document by email:", error);
    throw error;
  }
}

// Function to handle user registration and store info in the database
export async function registerUser(name, email, password, phoneNumber, bio) {
  try {
    // Create a user session
    const user = await account.create('unique()', email, password, name);
    console.log("Registering user with the following details:", {
      name,
      email,
      password,
      phoneNumber,
      bio,
    });
  
    // After user creation, store additional info in the Users collection
    const userInfo = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber || "", // Optional field
      bio: bio || "" // Optional field
    };

    // Store user info in the Users collection
    await databases.createDocument(
      databaseId,
      usersCollectionId,
      user.$id, // Use the user ID as the document ID
      userInfo
    );

    console.log("User registered and info stored:", userInfo);
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

// Function to handle user login and store user info if not exists
export async function handleLogin(email, password, name, phoneNumber, bio) {
  try {
    // Authenticate user
    const session = await account.createSession(email, password);
    
    // Check if user info already exists in the Users collection
    const response = await databases.listDocuments(databaseId, usersCollectionId, [
      Query.equal("email", email) // Check if the user already exists
    ]);

    if (response.total === 0) {
      // If user does not exist, register the user and store their info
      await registerUser(name, email, password, phoneNumber, bio);
    } else {
      console.log("User already exists, info retrieved:", response.documents[0]);
    }

    console.log("User logged in successfully:", session);
  } catch (error) {
    console.error("Error during login:", error);
  }
}

// Function to fetch user info
export async function getUserInfo(documentid) {
  try {
    const response = await databases.getDocument(databaseId, usersCollectionId, documentid);
    return response; 
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; 
  }
}

// Function to update user info
export const updateUserInfo = async (userid, updatedData) => {
  try {
    const { name, email, phoneNumber, bio } = updatedData;

    const dataToUpdate = {
      name,
      email,
      phoneNumber,
      bio,
    };

    const document = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      userid,
      dataToUpdate
    );

    return document; // Return the updated document
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

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
  const { amount, userid, title, description } = reportData;
  
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
  const { amount, rewardid, title, description } = rewardData;

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

export async function getRewardBalance(userid) {
  try {
    const response = await databases.listDocuments(databaseId, rewardsCollectionId, [
      Query.equal("userid", userid) // Filter rewards by the user's ID
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
