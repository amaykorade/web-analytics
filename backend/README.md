# Backend Server - Modular Architecture

This backend server has been refactored to follow proper separation of concerns with a clean, modular architecture.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js          # Centralized configuration constants
│   │   └── mongooseConfig.js     # Database connection configuration
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                 # Authentication feature
│   │   ├── tracking/             # Analytics tracking feature
│   │   ├── script/               # Script management feature
│   │   ├── payment/              # Payment processing feature
│   │   └── funnel/               # Funnel analysis feature
│   ├── middleware/
│   │   ├── cors.middleware.js    # CORS handling middleware
│   │   ├── jwt.middleware.js     # JWT authentication middleware
│   │   └── checkSubscriptionStatus.middleware.js
│   ├── services/
│   │   └── websocket.service.js  # WebSocket service for real-time features
│   └── cron-job/
│       └── subscription.cron.js  # Subscription management cron jobs
├── public/
│   └── js/                       # Static tracker scripts
├── server.js                     # Main server entry point
└── README.md                     # This file
```

## 🔧 Key Components

### 1. Server Entry Point (server.js)
- Clean, focused on Express server setup
- Uses modular middleware and services
- No WebSocket logic cluttering the main file

### 2. WebSocket Service (src/services/websocket.service.js)
- Handles all real-time communication
- Manages active users, page views, navigation paths
- Emits real-time updates to dashboard clients
- Singleton pattern for easy access

### 3. CORS Middleware (src/middleware/cors.middleware.js)
- Centralized CORS handling
- Dynamic origin management from database
- Caching for performance
- Separate handlers for different use cases

### 4. Constants Configuration (src/config/constants.js)
- Centralized configuration values
- Easy to modify and maintain
- Environment-specific settings

## 🚀 Real-time Features

The WebSocket service provides:

- **Active User Tracking**: Real-time visitor count per website
- **Page Popularity**: Live page view counts
- **Navigation Paths**: User journey tracking
- **Page Flow**: Conversion path analysis

## 📡 WebSocket Events

### Tracker Events (from client websites)
- `trackerEvent`: Page visits, clicks, scrolls
- `navigation`: User navigation paths

### Dashboard Events (to dashboard clients)
- `activeUserCount`: Current active users
- `pagePopularity`: Live page popularity data
- `pageFlow`: User flow analysis
- `liveNavigation`: Real-time navigation updates
- `livePageView`: New page visits
- `pageExit`: User leaving pages

## 🔄 Data Flow

1. **Tracker Script** → Sends events via WebSocket
2. **WebSocket Service** → Processes and stores real-time data
3. **Dashboard** → Receives live updates via WebSocket
4. **Database** → Stores persistent analytics data

## 🛠️ Development

### Starting the Server
```bash
npm run dev
```

### Key Benefits of New Architecture

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easy to modify individual components
3. **Testability**: Modular structure enables unit testing
4. **Scalability**: Services can be easily extended or replaced
5. **Readability**: Clean, organized code structure

### Adding New Features

1. **New WebSocket Events**: Add handlers in `websocket.service.js`
2. **New API Routes**: Create feature modules in `src/features/`
3. **New Middleware**: Add to `src/middleware/`
4. **Configuration**: Update `src/config/constants.js`

## 🔒 Security

- CORS protection with dynamic origin validation
- Rate limiting on tracking endpoints
- JWT authentication for API routes
- Input validation and sanitization

## 📊 Performance

- CORS origin caching (10 seconds)
- Efficient WebSocket room management
- Optimized real-time data structures
- Connection pooling for database

## 🐛 Debugging

The WebSocket service includes comprehensive logging:
- Connection events
- Data processing steps
- Error handling
- Performance metrics

Check console logs for real-time debugging information. 