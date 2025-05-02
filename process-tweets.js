// api/process-tweets.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Define the path to the data directory
    // In Vercel, your data directory should be included in your deployment
    const dataDirectory = path.join(process.cwd(), 'data');
    
    // Check if directory exists
    if (!fs.existsSync(dataDirectory)) {
      return res.status(404).json({ error: "Data directory not found" });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(dataDirectory);
    
    // Filter for only JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
    
    console.log(`Found ${jsonFiles.length} JSON files in data directory`);
    
    // Process each JSON file
    const userData = {};
    
    for (const file of jsonFiles) {
      const userId = path.basename(file, '.json');
      const filePath = path.join(dataDirectory, file);
      
      try {
        // Read and parse the JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const rawData = JSON.parse(fileContent);
        
        // Process the user data (customize this based on your JSON structure)
        userData[userId] = processUserData(rawData);
        
      } catch (fileError) {
        console.error(`Error processing file ${file}: ${fileError.message}`);
      }
    }
    
    // Calculate statistics
    const stats = getStatistics(userData);
    
    // Return the processed data and statistics
    return res.status(200).json({
      success: true,
      message: `Processed ${jsonFiles.length} user files`,
      statistics: stats,
      data: userData
    });
    
  } catch (error) {
    console.error('Error processing tweet data:', error);
    return res.status(500).json({ error: 'Failed to process tweet data' });
  }
}

/**
 * Process raw user tweet data into a standardized format
 * @param {Object} userData - Raw user data from JSON file
 * @returns {Object} - Processed user data
 */
function processUserData(userData) {
  // This is a placeholder - customize based on your JSON structure
  return {
    username: userData.username || 'unknown',
    tweetCount: Array.isArray(userData.tweets) ? userData.tweets.length : 0,
    tweets: userData.tweets || [],
    // Add more processing as needed
  };
}

/**
 * Generate summary statistics across all processed users
 * @param {Object} allUserData - Object containing processed data for all users
 * @returns {Object} - Statistics summary
 */
function getStatistics(allUserData) {
  const users = Object.keys(allUserData);
  const totalUsers = users.length;
  let totalTweets = 0;
  
  users.forEach(user => {
    totalTweets += allUserData[user].tweetCount;
  });
  
  return {
    totalUsers,
    totalTweets,
    users
  };
}
