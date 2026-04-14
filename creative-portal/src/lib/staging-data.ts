// src/lib/staging-data.ts

export const STAGING_MODE = false; // Toggle this to false to disable staging mode

export const STAGING_DATA = {
  diagnosis: {
    chartData: {
      labels: ['Governance', 'Talent', 'Process', 'Tech Stack', 'Data'],
      datasets: [
        {
          label: 'Current Maturity',
          data: [85, 40, 65, 55, 70],
          backgroundColor: 'rgba(46, 211, 198, 0.2)', // Teal with opacity
          borderColor: '#2ED3C6', // Teal
          borderWidth: 2,
          pointBackgroundColor: '#2ED3C6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#2ED3C6',
        },
      ],
    },
  },
  commandCenter: {
    pillars: [
      { id: 'p1', title: 'Operational Scalability', status: 'active', momentum: [10, 15, 13, 18, 20, 25, 24, 28, 30, 32], color: 'teal' },
      { id: 'p2', title: 'Market Penetration', status: 'active', momentum: [5, 8, 12, 10, 15, 18, 22, 25, 28, 35], color: 'teal' },
      { id: 'p3', title: 'Talent Density', status: 'active', momentum: [40, 38, 35, 36, 42, 45, 48, 50, 52, 55], color: 'teal' },
      { id: 'p4', title: 'Ecosystem Integration', status: 'active', momentum: [20, 22, 25, 28, 26, 30, 32, 35, 38, 40], color: 'teal' },
    ],
  },
  translation: {
    directive: 'Reduce Customer Friction',
    workstreams: [
      { id: 'w1', title: 'UX Audit', status: 'in_progress' },
      { id: 'w2', title: 'API Integration', status: 'pending' },
      { id: 'w3', title: 'Support Automation', status: 'planned' },
    ],
  },
  execution: {
    milestones: [
      { id: 'm1', title: 'System Architecture', status: 'completed', date: '2025-10-15' },
      { id: 'm2', title: 'Stress Testing', status: 'in_progress', date: '2025-10-30' },
      { id: 'm3', title: 'Global Rollout', status: 'planned', date: '2025-11-15' },
    ],
    copilotFeed: [
      { id: 'c1', message: 'System architecture aligned with Pillar 2. Proceeding to stress-test.', timestamp: 'Just now', type: 'system' },
      { id: 'c2', message: 'API Integration workstream initiated.', timestamp: '2h ago', type: 'system' },
    ],
  },
};
