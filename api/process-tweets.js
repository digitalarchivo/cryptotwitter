// api/process-tweets.js
const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    // Define the path to the data directory
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
        
        // Process the user data
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
};

/**
 * Process raw user tweet data into a standardized format
 * @param {Object} userData - Raw user data from JSON file
 * @returns {Object} - Processed user data
 */
function processUserData(userData) {
  // Make sure we preserve all tweet text completely
  let tweets = [];
  
  if (Array.isArray(userData.tweets)) {
    tweets = userData.tweets.map(tweet => {
      // Ensure the full text of each tweet is preserved
      return {
        id: tweet.id || generateId(),
        text: tweet.text || "",  // This ensures we have the complete text
        date: tweet.date || tweet.created_at || new Date().toISOString(),
        likes: tweet.likes || tweet.like_count || 0,
        comments: tweet.comments || tweet.reply_count || 0,
        bookmarks: tweet.bookmarks || 0,
        replyingTo: tweet.replyingTo || tweet.in_reply_to_user || null,
        // Include any other tweet data that might be useful
        media: tweet.media || []
      };
    });
  }
  
  return {
    username: userData.username || 'unknown',
    displayName: userData.displayName || userData.display_name || userData.name || userData.username || 'Unknown User',
    profileImage: userData.profileImage || userData.profile_image_url || null,
    tweetCount: tweets.length,
    tweets: tweets
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

/**
 * Generate a random ID for tweets that don't have one
 * @returns {string} - Random ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
