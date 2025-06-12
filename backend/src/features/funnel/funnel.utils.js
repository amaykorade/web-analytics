// Utility functions for funnel analytics

export function calculateFunnelStats(trackingData, funnelSteps) {
    // Group events by sessionId
    const sessions = {};
    trackingData.forEach(event => {
        if (!sessions[event.sessionId]) sessions[event.sessionId] = [];
        sessions[event.sessionId].push(event);
    });
  
    // For each session, determine which steps were completed in order
    // Map: stepIndex -> Set of unique visitorIds who reached this step
    const stepUserSets = funnelSteps.map(() => new Set());
  
    Object.values(sessions).forEach(events => {
        // Sort events by timestamp
        events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Keep track of which steps we've seen for this session
        const seenSteps = new Set();
        let stepIdx = 0;
        
        for (const event of events) {
            if (stepIdx >= funnelSteps.length) break;
            const step = funnelSteps[stepIdx];
            
            // Skip if we've already seen this step in this session
            if (seenSteps.has(stepIdx)) continue;
            
            if (
                (step.type === 'url' && event.url && matchUrl(step.value, event.url)) ||
                (step.type === 'event' && event.type === step.value)
            ) {
                stepUserSets[stepIdx].add(event.visitorId);
                seenSteps.add(stepIdx);
                stepIdx++;
            }
        }
    });
  
    // Calculate stats per step
    const stats = funnelSteps.map((step, idx) => ({
        step: step,
        users: stepUserSets[idx].size,
        dropoff: idx === 0 ? null : calcDropoff(stepUserSets[idx - 1].size, stepUserSets[idx].size),
    }));
  
    // Conversion rate to final step
    const conversionRate = stepUserSets[stepUserSets.length - 1].size && stepUserSets[0].size
        ? ((stepUserSets[stepUserSets.length - 1].size / stepUserSets[0].size) * 100).toFixed(2)
        : '0.00';
  
    return {
        steps: stats,
        conversionRate: `${conversionRate}%`,
        highestDropoff: findHighestDropoff(stats)
    };
}
  
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