// components/TweetCard.js
import React from 'react';
import styles from '../styles/TweetCard.module.css';

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

export default TweetCard;
