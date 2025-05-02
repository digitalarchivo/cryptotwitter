// api/debug-tweets.js
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
    
    // Debug information to return
    const debugInfo = {
      directory: dataDirectory,
      filesFound: jsonFiles,
      fileContents: {}
    };
    
    // Read the raw contents of each file for debugging
    for (const file of jsonFiles) {
      const filePath = path.join(dataDirectory, file);
      try {
        // Read the file content as string
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Try to parse it to check validity
        const parsedData = JSON.parse(fileContent);
        
        // Show tweet text for debugging truncation issues
        if (parsedData.tweets && Array.isArray(parsedData.tweets)) {
          debugInfo.fileContents[file] = {
            tweetCount: parsedData.tweets.length,
            sampleTweets: parsedData.tweets.slice(0, 3).map(tweet => ({
              text: tweet.text,
              textLength: tweet.text ? tweet.text.length : 0
            }))
          };
        } else {
          debugInfo.fileContents[file] = {
            parseError: "File doesn't contain expected tweets array structure"
          };
        }
      } catch (error) {
        debugInfo.fileContents[file] = {
          error: error.message
        };
      }
    }
    
    return res.status(200).json(debugInfo);
    
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return res.status(500).json({ error: 'Debug endpoint failed', message: error.message });
  }
};
