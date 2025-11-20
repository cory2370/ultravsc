# UltraVSC - React Version

This is the React version of the UltraVSC forum application.

## Project Structure

```
UltraVSC/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # Header with logo, credit, contact
│   │   ├── Login.jsx         # Login/Register forms
│   │   ├── MainApp.jsx      # Main forum page
│   │   ├── PostList.jsx     # List of posts
│   │   ├── Post.jsx         # Individual post component
│   │   ├── Comment.jsx      # Comment component
│   │   ├── CategoryFilter.jsx # Category filter buttons
│   │   └── CreatePostModal.jsx # Modal for creating posts
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── data/
│   │   └── posts.js         # Initial posts data
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # CSS imports
├── style.css                # Original CSS (imported)
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
└── index-react.html        # HTML template
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features

- ✅ React Router for navigation
- ✅ Protected routes (requires login)
- ✅ Authentication context with sessionStorage
- ✅ Post filtering by category
- ✅ Like/unlike posts
- ✅ Comment system
- ✅ Create new posts
- ✅ Report posts
- ✅ Responsive design

## Migration Notes

The React version maintains the same functionality as the original HTML/JS version:
- All styling is preserved (using the same `style.css`)
- All features work the same way
- Authentication uses sessionStorage
- Posts are stored in component state (can be upgraded to a backend later)

## Next Steps

To enhance this React app, consider:
- Adding a backend API (Express, Firebase, etc.)
- Using a state management library (Redux, Zustand)
- Adding real-time updates (WebSockets)
- Implementing proper user authentication
- Adding image upload functionality
- Implementing search functionality

