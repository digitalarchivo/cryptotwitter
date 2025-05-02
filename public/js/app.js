// public/js/app.js - Frontend JavaScript for the Twitter Archive

// Global state
let allTweets = [];
let activeUsers = new Set();

// DOM elements
const tweetsContainer = document.getElementById('tweets-container');
const userFilter = document.getElementById('user-filter');
const searchInput = document.getElementById('search');
const tweetCount = document.getElementById('tweet-count');
const accountCount = document.getElementById('account-count');

// Initialize the app
async function initApp() {
  try {
    // Show loading state
    tweetsContainer.innerHTML = '<div class="loading">Loading tweets...</div>';
    
    // Fetch all tweets
    const response = await fetch('/api/tweets');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    allTweets = await response.json();
    
    // Get unique users from tweets
    const users = new Set();
    allTweets.forEach(tweet => {
      const username = tweet._username || (tweet.user ? tweet.user.screen_name : null);
      if (username) {
        users.add(username);
        activeUsers.add(username);
      }
    });
    
    // Update user filter dropdown
    populateUserFilter(Array.from(users));
    
    // Update stats
    updateStats();
    
    // Display all tweets
    displayTweets(allTweets);
    
    // Add event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    tweetsContainer.innerHTML = `<div class="error">Failed to load tweets: ${error.message}</div>`;
  }
}

// Populate user filter dropdown
function populateUserFilter(users) {
  // Clear existing options except "All Users"
  while (userFilter.options.length > 1) {
    userFilter.remove(1);
  }
  
  // Add option for each user
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = `@${user}`;
    userFilter.appendChild(option);
  });
}

// Update statistics
function updateStats() {
  tweetCount.textContent = allTweets.length;
  accountCount.textContent = activeUsers.size;
}

// Display tweets in the container
function displayTweets(tweets) {
  // Clear existing tweets
  tweetsContainer.innerHTML = '';
  
  if (tweets.length === 0) {
    tweetsContainer.innerHTML = '<div class="no-results">No tweets found</div>';
    return;
  }
  
  // Create and append tweet elements
  tweets.forEach(tweet => {
    const tweetElement = createTweetElement(tweet);
    tweetsContainer.appendChild(tweetElement);
  });
}

// Create a single tweet element
function createTweetElement(tweet) {
  const tweetDiv = document.createElement('div');
  tweetDiv.className = 'tweet';
  
  // Get user information
  const user = tweet.user || {};
  const username = user.screen_name || tweet._username || 'unknown';
  const name = user.name || username;
  
  // Format date
  const date = new Date(tweet.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Add avatar if available
  let avatarHtml = '';
  if (user.profile_image_url) {
    avatarHtml = `<img src="${user.profile_image_url}" alt="${username}" class="avatar">`;
  } else {
    // Default avatar if none available
    avatarHtml = `<div class="avatar default-avatar">@</div>`;
  }
  
  // Process tweet text (handle links, hashtags, etc.)
  const processedText = processTweetText(tweet.text);
  
  // Create tweet HTML
  tweetDiv.innerHTML = `
    <div class="tweet-header">
      ${avatarHtml}
      <div class="user-info">
        <span class="name">${name}</span>
        <span class="screen-name">@${username}</span>
      </div>
      <div class="date">${formattedDate}</div>
    </div>
    <div class="tweet-content">${processedText}</div>
    <div class="tweet-actions">
      <span class="retweets">${tweet.retweet_count || 0} Retweets</span>
      <span class="likes">${tweet.favorite_count || 0} Likes</span>
    </div>
  `;
  
  return tweetDiv;
}

// Process tweet text to handle links, hashtags, and mentions
function processTweetText(text) {
  if (!text) return '';
  
  // Replace links with clickable links
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Replace hashtags with clickable tags
  text = text.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank" rel="noopener noreferrer">#$1</a>');
  
  // Replace mentions with clickable profiles
  text = text.replace(/@(\w+)/g, '<a href="https://twitter.com/$1" target="_blank" rel="noopener noreferrer">@$1</a>');
  
  return text;
}

// Filter tweets based on user selection and search query
function filterTweets() {
  const selectedUser = userFilter.value;
  const searchQuery = searchInput.value.toLowerCase().trim();
  
  let filteredTweets = allTweets;
  
  // Filter by user if not "all"
  if (selectedUser !== 'all') {
    filteredTweets = filteredTweets.filter(tweet => {
      const tweetUser = tweet._username || (tweet.user ? tweet.user.screen_name : null);
      return tweetUser === selectedUser;
    });
  }
  
  // Filter by search query if any
  if (searchQuery) {
    filteredTweets = filteredTweets.filter(tweet => {
      const tweetText = tweet.text ? tweet.text.toLowerCase() : '';
      const tweetUser = tweet._username || (tweet.user ? tweet.user.screen_name : '');
      const tweetName = tweet.user ? tweet.user.name.toLowerCase() : '';
      
      return tweetText.includes(searchQuery) || 
             tweetUser.toLowerCase().includes(searchQuery) ||
             tweetName.includes(searchQuery);
    });
  }
  
  // Display filtered tweets
  displayTweets(filteredTweets);
}

// Set up event listeners
function setupEventListeners() {
  // Filter dropdown change
  userFilter.addEventListener('change', filterTweets);
  
  // Search input (debounced)
  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(filterTweets, 300);
  });
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);