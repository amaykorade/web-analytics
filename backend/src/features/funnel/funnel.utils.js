// Utility functions for funnel analytics

export const calculateFunnelStats = (events, steps) => {
    console.log('[DEBUG] calculateFunnelStats called with:', {
        eventCount: events.length,
        stepsCount: steps.length,
        steps: steps
    });

    const sessions = {};
    const stepUserSets = steps.map(() => new Set());

    // Group events by session
    events.forEach(event => {
        if (!sessions[event.sessionId]) {
            sessions[event.sessionId] = [];
        }
        sessions[event.sessionId].push(event);
    });

    console.log('[DEBUG] Grouped events into sessions:', Object.keys(sessions).length);

    // Process each session
    Object.values(sessions).forEach(sessionEvents => {
        let currentStepIndex = 0;

        // Sort events by timestamp
        sessionEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Process each event in the session
        sessionEvents.forEach(event => {
            if (currentStepIndex >= steps.length) return;

            const step = steps[currentStepIndex];
            const eventPath = event.path || (event.url ? new URL(event.url).pathname : null);

            console.log('[DEBUG] Checking event against step:', {
                eventPath,
                stepValue: step.value,
                stepType: step.type,
                currentStepIndex,
                matches: eventPath === step.value
            });

            if (eventPath === step.value) {
                stepUserSets[currentStepIndex].add(event.visitorId);
                currentStepIndex++;
                console.log('[DEBUG] Step matched, moving to next step:', currentStepIndex);
            }
        });
    });

    // Calculate stats
    const totalVisitors = stepUserSets[0].size;
    const stepStats = steps.map((step, index) => {
        const visitors = stepUserSets[index].size;
        const dropoff = index === 0 ? "0%" : 
            `${(((stepUserSets[index - 1].size - visitors) / stepUserSets[index - 1].size) * 100).toFixed(2)}%`;
        
        return {
            name: step.name || step.value,
            visitors,
            dropoff
        };
    });

    const conversionRate = totalVisitors > 0 ? 
        `${((stepUserSets[stepUserSets.length - 1].size / totalVisitors) * 100).toFixed(2)}%` : 
        "0%";

    const result = {
        totalVisitors,
        conversionRate,
        steps: stepStats
    };

    console.log('[DEBUG] Final stats result:', result);

    return result;
};

// Helper: match URL with support for params (e.g., /product/:id)
function matchUrl(pattern, url) {
    // Remove protocol and domain from both URLs
    const cleanPattern = pattern.replace(/^https?:\/\/[^\/]+/, '');
    const cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
    
    // Remove trailing slashes
    const normalizedPattern = cleanPattern.replace(/\/$/, '');
    const normalizedUrl = cleanUrl.replace(/\/$/, '');
    
    // Exact match
    if (normalizedPattern === normalizedUrl) return true;
    
    // Support for :param style
    const patternParts = normalizedPattern.split('/').filter(Boolean);
    const urlParts = normalizedUrl.split('/').filter(Boolean);
    
    if (patternParts.length !== urlParts.length) return false;
    
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) continue;
        if (patternParts[i] !== urlParts[i]) return false;
    }
    
    return true;
}
  
function calcDropoff(prev, curr) {
    if (!prev) return null;
    return `${(((prev - curr) / prev) * 100).toFixed(2)}%`;
}
  
function findHighestDropoff(stats) {
    let max = 0, idx = null;
    stats.forEach((s, i) => {
      if (i === 0 || s.dropoff === null) return;
      const val = parseFloat(s.dropoff);
      if (val > max) {
        max = val;
        idx = i;
      }
    });
    if (idx !== null) {
      return {
        stepFrom: idx,
        stepTo: idx + 1,
        dropoff: stats[idx].dropoff
      };
    }
    return null;
  } 