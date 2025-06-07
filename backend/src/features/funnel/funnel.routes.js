import express from 'express';
import { createFunnel, getFunnels, getFunnelStats, updateFunnel, deleteFunnel } from './funnel.controller.js';

const FunnelRouter = express.Router();

// Create funnel
FunnelRouter.post('/', createFunnel);
// Get all funnels for a user/website
FunnelRouter.get('/', getFunnels);
// Get stats for a funnel
FunnelRouter.get('/:funnelId/stats', getFunnelStats);
// Update a funnel
FunnelRouter.put('/:funnelId', updateFunnel);
// Delete a funnel
FunnelRouter.delete('/:funnelId', deleteFunnel);

export default FunnelRouter; 