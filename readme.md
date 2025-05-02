# Crypto Twitter Tweet Archive

An archive of crypto Twitter tweets preserved for historical record. Key figures whose statements on social media are important for research and communities.

## Features

- Archive tweets from multiple crypto Twitter accounts
- Display tweets in a clean, responsive interface
- Filter tweets by user or search term
- Preserves original tweet metadata including timestamps and metrics

## Project Structure

```
cryptoarchivo/
├── data/
│   ├── users/
│   │   ├── user1.json
│   │   ├── user2.json
│   │   └── giganticrebirth.json
│   └── add_avatars.py
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── index.html
├── server.js
├── package.json
├── .gitignore
├── vercel.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/crypto-twitter-archive.git
   cd crypto-twitter-archive
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Create the data directory structure:
   ```
   mkdir -p data/users
   ```
   
4. Place your tweet JSON files in the `data/users` directory:
   - Name each file after the username (`username.json`)
   - Example: `giganticrebirth.json`

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Adding More Users

To add more users to the archive:

1. Place the user's tweet JSON file in the `data/users` directory
2. Name the file as `username.json` (e.g., `satoshi.json`)
3. The API will automatically detect and include the new user's tweets

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Follow the prompts and your archive will be deployed to Vercel's global CDN

## License

This project is for archival and educational purposes only. All tweets remain the intellectual property of their original creators.