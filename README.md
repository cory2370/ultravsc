# UltraVSC - Forum Vinschool Ocean Park

A modern, React-based forum application designed for Vinschool Ocean Park students and teachers. UltraVSC provides a platform for announcements, Q&A, resource sharing, and entertainment discussions with role-based permissions and threaded conversations.

## Key Features

- **Role-Based Access Control**: Four distinct user roles (Student, Teacher, Moderator, Site Maintainer) with different permissions
- **Thread Categories**: Organized discussions across Announcements, Q&A, Resources, and Entertainment
- **Nested Replies**: Full support for threaded conversations with unlimited reply depth
- **Real-time Filtering**: Category-based filtering for easy content discovery
- **Edit & Delete**: Users can edit/delete their own content; moderators and maintainers have elevated permissions
- **File Attachments**: Support for attaching files to threads (with size display)
- **Authentication**: Secure login/registration system with session persistence
- **Mock Mode**: Built-in mock API for development without a backend
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Visual Role Badges**: Color-coded badges to identify user roles at a glance

## Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.20.0** - Client-side routing
- **Vite 5.0.0** - Build tool and dev server

### Development
- **@vitejs/plugin-react 4.2.0** - React support for Vite
- **ESLint** - Code quality (configured via GitHub Actions)

### Storage
- LocalStorage for mock data persistence
- Supports external API integration via environment variables

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cory2370/ultravsc.git
   cd ultravsc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm preview
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional - only needed for live API mode):

```env
VITE_API_BASE_URL=https://your-api-server.com/api
```

**Note**: If `VITE_API_BASE_URL` is not set, the application automatically runs in **mock mode** using LocalStorage.

### Mock Mode (Default)

By default, UltraVSC runs with a mock API that stores data in LocalStorage:
- Pre-configured users from `src/data/users.json`
- Sample threads from `src/data/threads.js`
- All data persists in browser storage

### Live API Mode

To connect to a real backend, set `VITE_API_BASE_URL` to your API endpoint. The API should implement these endpoints (see API Endpoints section below).

## Usage Examples

### Creating a Thread

1. Click the "Tạo thread mới" input box on the main board
2. Select a category (Announcement, Q&A, Resources, Entertainment)
3. Enter title (max 200 chars) and content (max 5000 chars)
4. Optionally attach a file
5. Click "Đăng thread"

**Note**: Only Teachers, Moderators, and Maintainers can create Announcement threads.

### Replying to Threads

1. Click on any thread to open the detailed view
2. Scroll to the reply form at the bottom
3. Enter your reply text
4. Click "Gửi phản hồi"
5. To reply to a specific comment, click the "↩️ Trả lời" button on that comment

## Folder Structure

```
ultravsc/
├── .github/
│   └── workflows/
│       └── node.js.yml          # CI/CD pipeline for Node.js testing
├── src/
│   ├── components/              # React components
│   │   ├── BoardPage.jsx        # Main thread listing page
│   │   ├── CategoryFilter.jsx   # Category filter buttons
│   │   ├── Comment.jsx          # Individual comment component
│   │   ├── CreateThreadModal.jsx # Modal for creating threads
│   │   ├── EditThreadModal.jsx  # Modal for editing threads
│   │   ├── Header.jsx           # App header with user info
│   │   ├── Login.jsx            # Authentication page
│   │   ├── MainApp.jsx          # Main app layout wrapper
│   │   ├── Post.jsx             # Individual post/thread card
│   │   ├── PostList.jsx         # List of posts
│   │   ├── ReplyItem.jsx        # Nested reply component
│   │   ├── RoleBadge.jsx        # User role badge
│   │   ├── ThreadPage.jsx       # Detailed thread view
│   │   └── ThreadSummaryCard.jsx # Thread preview card
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context & provider
│   ├── data/
│   │   ├── threads.js           # Initial thread data
│   │   └── users.json           # Demo user accounts
│   ├── utils/
│   │   ├── api.js               # API abstraction layer (mock + live)
│   │   ├── roles.js             # Role configuration & permissions
│   │   └── storage.js           # LocalStorage utilities
│   ├── App.jsx                  # Root app component with routing
│   ├── index.css                # Global styles
│   └── main.jsx                 # React app entry point
├── index.html                   # HTML template
├── style.css                    # Main stylesheet
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
└── .gitignore                   # Git ignore rules
```

## API Endpoints

If running in live mode, your backend should implement these endpoints:

### Authentication
- `POST /auth/register` - Register new user
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "student|teacher|moderator|maintainer"
  }
  ```
- `POST /auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- `GET /users/me` - Get current user (requires Authorization header)

### Threads
- `GET /threads` - List all threads
- `GET /threads/:threadId` - Get single thread with replies
- `POST /threads` - Create new thread
- `PUT /threads/:threadId` - Update thread
- `DELETE /threads/:threadId` - Delete thread

### Replies
- `POST /threads/:threadId/replies` - Reply to thread
- `POST /threads/:threadId/replies/:parentReplyId` - Reply to comment
- `PUT /threads/:threadId/replies/:replyId` - Edit reply
- `DELETE /threads/:threadId/replies/:replyId` - Delete reply (and children)

All authenticated endpoints require:
```
Authorization: Bearer <token>
```

## Scripts

```bash
# Development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### CI/CD (GitHub Actions)

The project includes automated testing on:
- Node.js 18.x, 20.x, 22.x
- Runs on push/PR to main branch
- Executes: `npm ci`, `npm run build`, `npm test`

## Role Permissions

| Permission | Student | Teacher | Moderator | Maintainer |
|-----------|---------|---------|-----------|------------|
| View threads | ✅ | ✅ | ✅ | ✅ |
| Create threads | ✅ | ✅ | ✅ | ✅ |
| Create announcements | ❌ | ✅ | ✅ | ✅ |
| Edit own content | ✅ | ✅ | ✅ | ✅ |
| Delete own content | ✅ | ✅ | ✅ | ✅ |
| Edit any content | ❌ | ❌ | ✅ | ✅ |
| Delete any content | ❌ | ❌ | ✅ | ✅ |

## Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Standards
- Follow existing code style and formatting
- Ensure all builds pass (`npm run build`)
- Test in both mock and live API modes if applicable
- Update documentation for new features

## License

This project is maintained by Ngô Quang Tùng (9A5) for Vinschool Ocean Park.

For questions or support, contact via:
- **GitHub**: [@cory2370](https://github.com/cory2370)
- **Repository**: [github.com/cory2370/ultravsc](https://github.com/cory2370/ultravsc)

---

**Made with ❤️ by Ngô Quang Tùng (9A5)**
