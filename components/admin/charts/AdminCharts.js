import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Revenue Chart Component
export const RevenueChart = () => {
  const data = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    datasets: [
      {
        label: 'Выручка 2024',
        data: [120000, 135000, 165000, 145000, 190000, 210000, 185000, 225000, 240000, 280000, 320000, 350000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Выручка 2023',
        data: [95000, 110000, 125000, 120000, 145000, 160000, 155000, 175000, 185000, 200000, 220000, 240000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(156, 163, 175)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ₽' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return '₽' + (value / 1000) + 'k';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

// Category Sales Chart Component
export const CategoryChart = () => {
  const data = {
    labels: ['Тестостерон', 'Жиросжигание', 'Энергия', 'Витамины', 'Добавки'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Customer Growth Chart Component
export const CustomerGrowthChart = () => {
  const data = {
    labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4', 'Нед 5', 'Нед 6', 'Нед 7', 'Нед 8'],
    datasets: [
      {
        label: 'Новые клиенты',
        data: [12, 19, 15, 25, 22, 30, 28, 35],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Повторные покупки',
        data: [8, 12, 10, 18, 15, 20, 22, 25],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          font: {
            size: 11
          },
          stepSize: 5
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

// Top Products Chart Component
export const TopProductsChart = () => {
  const data = {
    labels: ['TONGKAT ALI', 'YOHIMBINE HCL', 'MACA POWDER', 'ZINC COMPLEX', 'ARPOZAN PACK'],
    datasets: [
      {
        label: 'Продажи',
        data: [298, 234, 189, 156, 145],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return 'Продано: ' + context.parsed.x + ' шт.';
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};