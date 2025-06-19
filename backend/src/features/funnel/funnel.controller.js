import { FunnelModel } from './funnel.model.js';
import { calculateFunnelStats } from './funnel.utils.js';
import { TrackingModule } from '../tracking/tracking.schema.js';
import mongoose from 'mongoose';

// Create a new funnel
export const createFunnel = async (req, res) => {
  try {
    const { funnelName, steps, websiteName } = req.body;
    const userId = req.userID || req.body.userId; // support both auth middleware or direct

    if (!userId || !websiteName || !funnelName || !Array.isArray(steps) || steps.length === 0 || steps.length > 5) {
      return res.status(400).json({ message: 'Invalid funnel data.' });
    }
    for (const step of steps) {
      if (!['url', 'event'].includes(step.type) || !step.value) {
        return res.status(400).json({ message: 'Each step must have a valid type and value.' });
      }
    }
    const funnel = new FunnelModel({ userId, websiteName, funnelName, steps });
    await funnel.save();
    res.status(201).json(funnel);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create funnel', error: error.message });
  }
};

// Get all funnels for a user/website
export const getFunnels = async (req, res) => {
  try {
    const userId = req.userID || req.query.userId;
    const websiteName = req.query.websiteName;
    if (!userId || !websiteName) {
      return res.status(400).json({ message: 'userId and websiteName are required' });
    }
    const funnels = await FunnelModel.find({ userId, websiteName });
    res.json(funnels);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch funnels', error: error.message });
  }
};

// Get stats for a funnel
export const getFunnelStats = async (req, res) => {
  try {
    const { funnelId, userId, websiteName, startDate, endDate } = req.query;

    console.log('[DEBUG] getFunnelStats called with:', {
      funnelId,
      userId,
      websiteName,
      startDate,
      endDate,
      query: req.query,
      params: req.params
    });

    if (!funnelId || !userId || !websiteName) {
      console.log('[DEBUG] Missing required parameters:', { funnelId, userId, websiteName });
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const funnel = await FunnelModel.findOne({
      _id: funnelId,
      userId,
      websiteName
    });

    if (!funnel) {
      return res.status(404).json({ message: "Funnel not found" });
    }

    const match = {
      userId: new mongoose.Types.ObjectId(userId),
      websiteName,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const trackingData = await TrackingModule.find(match).sort({ timestamp: 1 });

    if (!trackingData || trackingData.length === 0) {
      return res.status(200).json({
        message: "No tracking data found for the given criteria",
        stats: {
          totalVisitors: 0,
          conversionRate: "0%",
          steps: funnel.steps.map(step => ({
            name: step.name,
            visitors: 0,
            dropoff: "0%"
          }))
        }
      });
    }

    const stats = calculateFunnelStats(trackingData, funnel.steps);

    res.status(200).json({
      message: "Funnel stats retrieved successfully",
      stats
    });
  } catch (error) {
    console.error("Error getting funnel stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a funnel
export const updateFunnel = async (req, res) => {
  // TODO: Implement
};

// Delete a funnel
export const deleteFunnel = async (req, res) => {
  try {
    const { funnelId } = req.params;
    const userId = req.userID || req.query.userId;

    if (!funnelId || !userId) {
      return res.status(400).json({ message: 'funnelId and userId are required' });
    }

    const funnel = await FunnelModel.findOneAndDelete({ _id: funnelId, userId });
    
    if (!funnel) {
      return res.status(404).json({ message: 'Funnel not found' });
    }

    res.json({ message: 'Funnel deleted successfully', funnelId });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    res.status(500).json({ message: 'Failed to delete funnel', error: error.message });
  }
}; 