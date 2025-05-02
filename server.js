// server.js - Simple Express server for local development
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('./'));

// API endpoint to get list of available users
app.get('/api/users', (req, res) => {
  const usersDir = path.join(__dirname, 'data', 'users');
  
  try {
    // Read directory to get all JSON files
    const files = fs.readdirSync(usersDir)
      .filter(file => file.endsWith('.json'));
    
    // Return usernames without .json extension
    const users = files.map(file => ({
      id: file.replace('.json', ''),
      filename: file
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error reading users directory:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// API endpoint to get tweets for a specific user
app.get('/api/tweets/:user', (req, res) => {
  const { user } = req.params;
  const filename = user.endsWith('.json') ? user : `${user}.json`;
  const filePath = path.join(__dirname, 'data', 'users', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'User tweets not found' });
    }
  } catch (error) {
    console.error(`Error reading tweets for ${user}:`, error);
    res.status(500).json({ error: 'Failed to retrieve tweets' });
  }
});

// API endpoint to get all tweets from all users
app.get('/api/tweets', (req, res) => {
  const usersDir = path.join(__dirname, 'data', 'users');
  
  try {
    // Get all JSON files in the users directory
    const files = fs.readdirSync(usersDir)
      .filter(file => file.endsWith('.json'));
    
    let allTweets = [];
    
    // Read and combine tweets from all files
    files.forEach(file => {
      const filePath = path.join(usersDir, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const tweets = JSON.parse(data);
      
      // Add username from filename to each tweet
      const username = file.replace('.json', '');
      tweets.forEach(tweet => {
        tweet._username = username;
      });
      
      allTweets = allTweets.concat(tweets);
    });
    
    // Sort tweets by date (newest first)
    allTweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(allTweets);
  } catch (error) {
    console.error('Error reading tweets:', error);
    res.status(500).json({ error: 'Failed to retrieve tweets' });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});