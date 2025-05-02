// components/TweetCard.js
const React = require('react');
const styles = require('../styles/TweetCard.module.css');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

const TweetCard = ({ tweet }) => {
  return (
    <div className={styles.tweetCard}>
      <div className={styles.tweetHeader}>
        <div className={styles.userInfo}>
          {tweet.profileImage && (
            <img 
              src={tweet.profileImage} 
              alt={`${tweet.username}'s profile`} 
              className={styles.profileImage}
            />
          )}
          <div>
            <div className={styles.nameContainer}>
              <span className={styles.displayName}>{tweet.displayName}</span>
              <span className={styles.username}>@{tweet.username}</span>
            </div>
            <span className={styles.date}>{formatDate(tweet.date)}</span>
          </div>
        </div>
        <div className={styles.tweetActions}>
          <button className={styles.replyButton}>Reply</button>
          <button className={styles.archivedButton}>Archived</button>
        </div>
      </div>
      
      {/* Tweet content with complete text display */}
      <div className={styles.tweetContent}>
        {tweet.replyingTo && (
          <div className={styles.replyingTo}>
            @{tweet.replyingTo}
          </div>
        )}
        <div className={styles.fullText}>{tweet.text}</div>
      </div>
      
      <div className={styles.tweetStats}>
        <div className={styles.stat}>
          <span className={styles.heartIcon}>❤️</span>
          <span>{tweet.likes || 0}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.bookmarkIcon}>🔖</span>
          <span>{tweet.bookmarks || 0}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.commentIcon}>💬</span>
          <span>{tweet.comments || 0}</span>
        </div>
      </div>
    </div>
  );
};

module.exports = TweetCard;

// pages/index.js
const { useEffect, useState } = require('react');
const TweetCard = require('../components/TweetCard');
const styles = require('../styles/Home.module.css');

function Home() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all tweets from our API endpoint
    async function fetchTweetData() {
      try {
        setLoading(true);
        const response = await fetch('/api/process-tweets');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        console.error('Failed to fetch tweet data:', err);
        setError('Failed to load tweets. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTweetData();
  }, []);

  // Convert all user data into a flat array of tweets for display
  const getAllTweets = () => {
    const allTweets = [];
    
    // Loop through each user and extract their tweets
    Object.keys(userData).forEach(userId => {
      const user = userData[userId];
      if (Array.isArray(user.tweets)) {
        user.tweets.forEach(tweet => {
          // Add user information to each tweet
          allTweets.push({
            ...tweet,
            username: user.username || userId,
            displayName: user.displayName || user.username || userId,
            profileImage: user.profileImage || '/default-avatar.png'
          });
        });
      }
    });
    
    // Sort tweets by date (most recent first)
    return allTweets.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const tweets = getAllTweets();

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading tweets...</div></div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>{error}</div></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Tweets</h1>
      
      {tweets.length === 0 ? (
        <div className={styles.noTweets}>No tweets found</div>
      ) : (
        <div className={styles.tweetFeed}>
          {tweets.map((tweet, index) => (
            <TweetCard key={`tweet-${index}`} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}

module.exports = Home;
