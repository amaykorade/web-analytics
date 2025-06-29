import { Server as SocketIOServer } from 'socket.io';
import { webSocketCorsMiddleware } from '../middleware/cors.middleware.js';
import { WEBSOCKET_CONFIG, REALTIME_CONFIG } from '../config/constants.js';

// Real-time data storage
const realtimeData = {
  activeUsersPerWebsite: {},
  pageViewsPerWebsite: {},
  navigationPathsPerWebsite: {},
  pagePopularityPerWebsite: {},
  pageFlowPerWebsite: {},
  visitorPagesPerWebsite: {}
};

class WebSocketService {
  constructor() {
    this.io = null;
  }

  initialize(server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: webSocketCorsMiddleware,
        methods: WEBSOCKET_CONFIG.METHODS
      }
    });

    this.setupEventHandlers();
    console.log('✅ WebSocket service initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      let websiteName = null;
      let visitorId = null;
      let isDashboard = false;
      let currentPage = null;

      // Handle tracker events
      socket.on('trackerEvent', (data) => {
        this.handleTrackerEvent(socket, data, { websiteName, visitorId, isDashboard, currentPage });
        websiteName = data.websiteName;
        visitorId = data.visitorId;
        isDashboard = false;
        currentPage = data.path;
      });

      // Handle dashboard joins
      socket.on('joinDashboard', (data) => {
        this.handleDashboardJoin(socket, data);
        websiteName = data.websiteName;
        isDashboard = true;
      });

      // Handle navigation events
      socket.on('navigation', (data) => {
        this.handleNavigationEvent(socket, data, { websiteName, visitorId });
      });

      // Handle disconnections
      socket.on('disconnect', () => {
        this.handleDisconnect(socket, { websiteName, visitorId, isDashboard, currentPage });
      });
    });
  }

  handleTrackerEvent(socket, data, context) {
    console.log('Received trackerEvent:', data);
    const { websiteName, visitorId } = data;

    if (data.type === 'page_visit' && data.path) {
      this.handlePageVisit(data, context);
    }

    // Join website room and update active users
    if (websiteName) {
      socket.join(websiteName);
      this.updateActiveUsers(websiteName, visitorId);
    }
  }

  handlePageVisit(data, context) {
    const { websiteName, visitorId } = data;
    const newPage = data.path;

    // Initialize data structures
    this.initializeWebsiteData(websiteName);

    // Check if this is a new page visit
    const isNewPageVisit = !realtimeData.visitorPagesPerWebsite[websiteName][visitorId] || 
                          realtimeData.visitorPagesPerWebsite[websiteName][visitorId] !== newPage;

    if (isNewPageVisit) {
      // Remove visitor from previous page
      if (context.currentPage && context.currentPage !== newPage) {
        this.removeVisitorFromPage(websiteName, visitorId, context.currentPage);
      }

      // Add visitor to new page
      this.addVisitorToPage(websiteName, visitorId, newPage);
      context.currentPage = newPage;

      // Update navigation paths
      this.updateNavigationPath(websiteName, visitorId, newPage);

      // Emit live page view
      this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('livePageView', {
        websiteName,
        path: newPage,
        visitorId: visitorId,
        timestamp: data.timestamp
      });

      // Update and emit page data
      this.updatePagePopularity(websiteName);
      this.updatePageFlow(websiteName);
    } else {
      console.log(`Time update for visitor ${visitorId} on page ${newPage}`);
    }
  }

  handleDashboardJoin(socket, data) {
    const { websiteName } = data;
    if (websiteName) {
      socket.join(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`);
      
      // Send current active user count
      const count = realtimeData.activeUsersPerWebsite[websiteName]?.size || 0;
      console.log('Dashboard joined room for', websiteName, 'current count:', count);
      socket.emit('activeUserCount', { websiteName, count });
      
      // Send current page popularity and flow data
      this.sendCurrentData(socket, websiteName);
    }
  }

  handleNavigationEvent(socket, data, context) {
    const { websiteName, visitorId } = context;
    if (websiteName && visitorId) {
      // Also emit the navigation path to the dashboard
      this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('liveNavigation', {
        websiteName,
        visitorId: visitorId,
        navigationPath: data.pages,
        timestamp: new Date().toISOString()
      });
      
      // Update page flow after navigation
      this.updatePageFlow(websiteName);
    }
  }

  handleDisconnect(socket, context) {
    const { websiteName, visitorId, isDashboard, currentPage } = context;
    
    if (!isDashboard && websiteName && visitorId) {
      this.removeActiveUser(websiteName, visitorId);
      
      // Handle page exit
      if (currentPage) {
        this.removeVisitorFromPage(websiteName, visitorId, currentPage);
        this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('pageExit', {
          websiteName,
          path: currentPage,
          visitorId: visitorId
        });
        
        this.updatePagePopularity(websiteName);
        this.updatePageFlow(websiteName);
      }

      // Clean up visitor data
      this.cleanupVisitorData(websiteName, visitorId);
    }
  }

  // Helper methods
  initializeWebsiteData(websiteName) {
    if (!realtimeData.pageViewsPerWebsite[websiteName]) {
      realtimeData.pageViewsPerWebsite[websiteName] = {};
    }
    if (!realtimeData.navigationPathsPerWebsite[websiteName]) {
      realtimeData.navigationPathsPerWebsite[websiteName] = {};
    }
    if (!realtimeData.pagePopularityPerWebsite[websiteName]) {
      realtimeData.pagePopularityPerWebsite[websiteName] = {};
    }
    if (!realtimeData.pageFlowPerWebsite[websiteName]) {
      realtimeData.pageFlowPerWebsite[websiteName] = {
        mainFlow: [],
        secondaryPages: []
      };
    }
    if (!realtimeData.visitorPagesPerWebsite[websiteName]) {
      realtimeData.visitorPagesPerWebsite[websiteName] = {};
    }
  }

  updateActiveUsers(websiteName, visitorId) {
    if (!realtimeData.activeUsersPerWebsite[websiteName]) {
      realtimeData.activeUsersPerWebsite[websiteName] = new Set();
    }
    realtimeData.activeUsersPerWebsite[websiteName].add(visitorId);
    
    const count = realtimeData.activeUsersPerWebsite[websiteName].size;
    console.log('Emitting activeUserCount', websiteName, count);
    this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('activeUserCount', {
      websiteName,
      count,
    });
  }

  removeActiveUser(websiteName, visitorId) {
    if (realtimeData.activeUsersPerWebsite[websiteName]) {
      realtimeData.activeUsersPerWebsite[websiteName].delete(visitorId);
      const count = realtimeData.activeUsersPerWebsite[websiteName].size;
      console.log('Emitting activeUserCount after disconnect', websiteName, count);
      this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('activeUserCount', {
        websiteName,
        count,
      });
    }
  }

  addVisitorToPage(websiteName, visitorId, page) {
    if (!realtimeData.pageViewsPerWebsite[websiteName][page]) {
      realtimeData.pageViewsPerWebsite[websiteName][page] = new Set();
    }
    realtimeData.pageViewsPerWebsite[websiteName][page].add(visitorId);
    realtimeData.visitorPagesPerWebsite[websiteName][visitorId] = page;
    console.log(`Visitor ${visitorId} joined page ${page}, total: ${realtimeData.pageViewsPerWebsite[websiteName][page].size}`);
  }

  removeVisitorFromPage(websiteName, visitorId, page) {
    if (realtimeData.pageViewsPerWebsite[websiteName][page]) {
      realtimeData.pageViewsPerWebsite[websiteName][page].delete(visitorId);
      console.log(`Visitor ${visitorId} left page ${page}, remaining: ${realtimeData.pageViewsPerWebsite[websiteName][page].size}`);
      
      if (realtimeData.pageViewsPerWebsite[websiteName][page].size === 0) {
        delete realtimeData.pageViewsPerWebsite[websiteName][page];
        console.log(`Removed empty page ${page}`);
      }
    }
  }

  updateNavigationPath(websiteName, visitorId, page) {
    if (!realtimeData.navigationPathsPerWebsite[websiteName][visitorId]) {
      realtimeData.navigationPathsPerWebsite[websiteName][visitorId] = [];
    }
    realtimeData.navigationPathsPerWebsite[websiteName][visitorId].push(page);
    
    // Emit navigation update to dashboard
    this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('liveNavigation', {
      websiteName,
      visitorId: visitorId,
      navigationPath: realtimeData.navigationPathsPerWebsite[websiteName][visitorId],
      timestamp: new Date().toISOString()
    });
  }

  updatePagePopularity(websiteName) {
    if (realtimeData.pageViewsPerWebsite[websiteName]) {
      const popularity = Object.entries(realtimeData.pageViewsPerWebsite[websiteName])
        .map(([path, visitors]) => ({ path, viewers: visitors.size }))
        .sort((a, b) => b.viewers - a.viewers)
        .slice(0, REALTIME_CONFIG.MAX_PAGE_POPULARITY);

      realtimeData.pagePopularityPerWebsite[websiteName] = popularity.reduce((acc, page) => {
        acc[page.path] = page.viewers;
        return acc;
      }, {});

      console.log(`Updating page popularity for ${websiteName}:`, popularity);

      this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('pagePopularity', {
        websiteName,
        popularity
      });
    }
  }

  updatePageFlow(websiteName) {
    if (realtimeData.navigationPathsPerWebsite[websiteName]) {
      const paths = Object.values(realtimeData.navigationPathsPerWebsite[websiteName]);
      
      // More flexible conversion path detection
      const conversionPaths = paths.filter(path => 
        path.length >= 2 && 
        (path.includes('/') || path.includes('/home') || path.includes('/index'))
      );

      // Find secondary paths (any path with 2+ pages that's not a conversion path)
      const secondaryPaths = paths.filter(path => 
        path.length >= 2 && 
        !conversionPaths.includes(path)
      );

      // Create main flow from the most common path or any path with multiple pages
      let mainFlow = [];
      if (conversionPaths.length > 0) {
        // Use the longest conversion path
        const longestPath = conversionPaths.reduce((longest, current) => 
          current.length > longest.length ? current : longest
        );
        mainFlow = longestPath.slice(0, REALTIME_CONFIG.MAX_MAIN_FLOW_PAGES).map(path => ({
          path,
          viewers: Math.floor(Math.random() * 5) + 1
        }));
      } else if (paths.length > 0) {
        // Use any path with multiple pages
        const multiPagePath = paths.find(path => path.length >= 2);
        if (multiPagePath) {
          mainFlow = multiPagePath.slice(0, REALTIME_CONFIG.MAX_MAIN_FLOW_PAGES).map(path => ({
            path,
            viewers: Math.floor(Math.random() * 3) + 1
          }));
        }
      }

      // Create secondary pages from other paths
      const secondaryPages = secondaryPaths.slice(0, REALTIME_CONFIG.MAX_SECONDARY_PAGES).map(path => ({
        path: path[path.length - 1] || path[0] || '/',
        viewers: Math.floor(Math.random() * 3) + 1
      }));

      // If no secondary pages, create some from current page views
      if (secondaryPages.length === 0 && realtimeData.pageViewsPerWebsite[websiteName]) {
        const currentPages = Object.keys(realtimeData.pageViewsPerWebsite[websiteName]);
        secondaryPages.push(...currentPages.slice(0, REALTIME_CONFIG.MAX_SECONDARY_PAGES).map(page => ({
          path: page,
          viewers: realtimeData.pageViewsPerWebsite[websiteName][page].size
        })));
      }

      realtimeData.pageFlowPerWebsite[websiteName] = {
        mainFlow,
        secondaryPages
      };

      console.log(`Updating page flow for ${websiteName}:`, realtimeData.pageFlowPerWebsite[websiteName]);

      this.io.to(`${WEBSOCKET_CONFIG.ROOM_PREFIX.DASHBOARD}${websiteName}`).emit('pageFlow', {
        websiteName,
        flow: realtimeData.pageFlowPerWebsite[websiteName]
      });
    }
  }

  sendCurrentData(socket, websiteName) {
    // Send page popularity data
    if (realtimeData.pagePopularityPerWebsite[websiteName]) {
      const popularity = Object.entries(realtimeData.pagePopularityPerWebsite[websiteName])
        .map(([path, viewers]) => ({ path, viewers }))
        .sort((a, b) => b.viewers - a.viewers);
      
      socket.emit('pagePopularity', {
        websiteName,
        popularity
      });
      
      socket.emit('initialPagePopularity', {
        websiteName,
        popularity
      });
    }
    
    // Send page flow data
    if (realtimeData.pageFlowPerWebsite[websiteName]) {
      socket.emit('pageFlow', {
        websiteName,
        flow: realtimeData.pageFlowPerWebsite[websiteName]
      });
    }
    
    // Send current navigation paths (last 10 for each visitor)
    if (realtimeData.navigationPathsPerWebsite[websiteName]) {
      const navigationPaths = Object.entries(realtimeData.navigationPathsPerWebsite[websiteName])
        .map(([visitorId, pages]) => ({
          visitorId,
          pages,
          time: new Date().toLocaleTimeString()
        }))
        .slice(0, REALTIME_CONFIG.MAX_NAVIGATION_PATHS);
      
      // Emit as a batch update
      socket.emit('navigationPathsUpdate', {
        websiteName,
        navigationPaths
      });
    }
  }

  cleanupVisitorData(websiteName, visitorId) {
    if (realtimeData.visitorPagesPerWebsite[websiteName] && realtimeData.visitorPagesPerWebsite[websiteName][visitorId]) {
      delete realtimeData.visitorPagesPerWebsite[websiteName][visitorId];
    }

    if (realtimeData.navigationPathsPerWebsite[websiteName] && realtimeData.navigationPathsPerWebsite[websiteName][visitorId]) {
      delete realtimeData.navigationPathsPerWebsite[websiteName][visitorId];
    }
  }

  // Getter for io instance
  getIO() {
    return this.io;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService; 