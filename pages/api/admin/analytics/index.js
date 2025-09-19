// Analytics and dashboard API - Supabase Version
import { requireAdminMock } from '../../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Mock analytics data for development
      const analyticsData = {
        revenue: {
          total: 2400000,
          growth: 12.3,
          trend: 'up'
        },
        orders: {
          total: 1234,
          growth: 8.7,
          trend: 'up'
        },
        customers: {
          total: 856,
          growth: 15.2,
          trend: 'up'
        },
        conversion: {
          rate: 3.2,
          growth: 0.5,
          trend: 'up'
        },
        chartData: [
          { date: '2025-01-10', revenue: 75000, orders: 45 },
          { date: '2025-01-11', revenue: 82000, orders: 52 },
          { date: '2025-01-12', revenue: 78000, orders: 48 },
          { date: '2025-01-13', revenue: 91000, orders: 58 },
          { date: '2025-01-14', revenue: 88000, orders: 55 },
          { date: '2025-01-15', revenue: 94000, orders: 62 },
          { date: '2025-01-16', revenue: 87000, orders: 51 },
          { date: '2025-01-17', revenue: 96000, orders: 64 }
        ],
        timestamp: new Date().toISOString()
      };

      res.status(200).json(analyticsData);
    } catch (error) {
      console.error('Analytics API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics data',
        message: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed` 
    });
  }
}

export default requireAdminMock(handler);
