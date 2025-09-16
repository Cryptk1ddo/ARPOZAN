import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../shared/Icon';

const MonitoringView = () => {
  const [systemHealth, setSystemHealth] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [serverMetrics, setServerMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [uptimeData, setUptimeData] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({});

  // Mock system monitoring data
  useEffect(() => {
    const generatePerformanceData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.round(20 + Math.random() * 60),
          memory: Math.round(30 + Math.random() * 50),
          disk: Math.round(15 + Math.random() * 25),
          network: Math.round(10 + Math.random() * 40),
          responseTime: Math.round(100 + Math.random() * 300),
          requests: Math.round(50 + Math.random() * 150)
        });
      }
      return data;
    };

    const mockErrorLogs = [
      {
        id: 1,
        timestamp: new Date('2025-09-16T14:30:00'),
        level: 'error',
        message: 'Payment gateway timeout',
        source: 'payment-service',
        count: 3,
        resolved: false
      },
      {
        id: 2,
        timestamp: new Date('2025-09-16T14:15:00'),
        level: 'warning',
        message: 'High memory usage detected',
        source: 'system-monitor',
        count: 1,
        resolved: true
      },
      {
        id: 3,
        timestamp: new Date('2025-09-16T13:45:00'),
        level: 'info',
        message: 'Database backup completed',
        source: 'backup-service',
        count: 1,
        resolved: true
      },
      {
        id: 4,
        timestamp: new Date('2025-09-16T13:20:00'),
        level: 'error',
        message: 'Email service connection failed',
        source: 'email-service',
        count: 2,
        resolved: false
      }
    ];

    const mockServerMetrics = [
      {
        name: 'Web Server',
        status: 'healthy',
        uptime: '99.9%',
        cpu: 45,
        memory: 68,
        requests: 1250,
        avgResponse: 180,
        lastCheck: new Date()
      },
      {
        name: 'Database',
        status: 'healthy',
        uptime: '99.8%',
        cpu: 32,
        memory: 72,
        connections: 25,
        avgQuery: 120,
        lastCheck: new Date()
      },
      {
        name: 'Cache Server',
        status: 'warning',
        uptime: '98.5%',
        cpu: 78,
        memory: 85,
        hitRate: 92.5,
        avgResponse: 25,
        lastCheck: new Date()
      },
      {
        name: 'Payment Gateway',
        status: 'error',
        uptime: '95.2%',
        cpu: 15,
        memory: 45,
        transactions: 89,
        avgResponse: 850,
        lastCheck: new Date()
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        type: 'critical',
        title: 'Payment Gateway Down',
        description: 'Payment processing service is not responding',
        timestamp: new Date('2025-09-16T14:30:00'),
        acknowledged: false,
        source: 'payment-gateway'
      },
      {
        id: 2,
        type: 'warning',
        title: 'High CPU Usage',
        description: 'Cache server CPU usage above 75% for 10 minutes',
        timestamp: new Date('2025-09-16T14:20:00'),
        acknowledged: true,
        source: 'cache-server'
      },
      {
        id: 3,
        type: 'info',
        title: 'Backup Completed',
        description: 'Daily database backup completed successfully',
        timestamp: new Date('2025-09-16T13:45:00'),
        acknowledged: true,
        source: 'backup-service'
      }
    ];

    const generateUptimeData = () => {
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
          uptime: Math.round(95 + Math.random() * 5),
          incidents: Math.floor(Math.random() * 3),
          responseTime: Math.round(150 + Math.random() * 100)
        });
      }
      return data;
    };

    setTimeout(() => {
      setPerformanceData(generatePerformanceData());
      setErrorLogs(mockErrorLogs);
      setServerMetrics(mockServerMetrics);
      setAlerts(mockAlerts);
      setUptimeData(generateUptimeData());
      setSystemHealth({
        overallStatus: 'warning',
        uptime: '99.2%',
        totalRequests: 25600,
        avgResponseTime: 245,
        errorRate: 0.8,
        activeUsers: 156,
        serverLoad: 67,
        dbConnections: 25
      });
      setRealTimeMetrics({
        cpu: 45,
        memory: 68,
        disk: 32,
        network: 24,
        activeConnections: 234,
        requestsPerSecond: 12.5
      });
      setLoading(false);
    }, 500);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setRealTimeMetrics(prev => ({
          cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
          disk: Math.max(10, Math.min(80, prev.disk + (Math.random() - 0.5) * 3)),
          network: Math.max(5, Math.min(50, prev.network + (Math.random() - 0.5) * 8)),
          activeConnections: Math.max(100, Math.min(500, prev.activeConnections + Math.floor((Math.random() - 0.5) * 20))),
          requestsPerSecond: Math.max(5, Math.min(25, prev.requestsPerSecond + (Math.random() - 0.5) * 2))
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Здоров';
      case 'warning': return 'Предупреждение';
      case 'error': return 'Ошибка';
      case 'critical': return 'Критично';
      default: return status;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            🖥️ Мониторинг системы
          </h1>
          <p className="text-gray-600 mt-1">
            Контроль производительности, здоровья системы и обработка инцидентов
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className={`px-3 py-2 rounded-lg border ${getStatusColor(systemHealth.overallStatus)}`}>
            <span className="text-sm font-medium">
              Общий статус: {getStatusText(systemHealth.overallStatus)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Обновлено: {new Date().toLocaleTimeString('ru-RU')}
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            name: 'Время работы', 
            value: systemHealth.uptime, 
            icon: '⏱️',
            change: '+0.1%',
            trend: 'up'
          },
          { 
            name: 'Запросы/час', 
            value: systemHealth.totalRequests?.toLocaleString(), 
            icon: '📊',
            change: '+12%',
            trend: 'up'
          },
          { 
            name: 'Время отклика', 
            value: `${systemHealth.avgResponseTime}ms`, 
            icon: '⚡',
            change: '-15ms',
            trend: 'up'
          },
          { 
            name: 'Активные пользователи', 
            value: systemHealth.activeUsers?.toLocaleString(), 
            icon: '👥',
            change: '+8',
            trend: 'up'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-black text-white">
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <Icon 
                  path={metric.trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                  className="w-4 h-4" 
                />
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
              <p className="text-2xl font-bold text-black">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Обзор', icon: '📊' },
            { id: 'performance', name: 'Производительность', icon: '⚡' },
            { id: 'servers', name: 'Серверы', icon: '🖥️' },
            { id: 'logs', name: 'Логи', icon: '📝' },
            { id: 'alerts', name: 'Уведомления', icon: '🔔' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-6">📈 Метрики в реальном времени</h3>
                <div className="space-y-4">
                  {[
                    { name: 'CPU', value: realTimeMetrics.cpu, unit: '%', max: 100 },
                    { name: 'Память', value: realTimeMetrics.memory, unit: '%', max: 100 },
                    { name: 'Диск', value: realTimeMetrics.disk, unit: '%', max: 100 },
                    { name: 'Сеть', value: realTimeMetrics.network, unit: 'MB/s', max: 50 }
                  ].map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{metric.name}</span>
                        <span className="font-medium text-black">{metric.value?.toFixed(1)}{metric.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric.value > 80 ? 'bg-red-500' : 
                            metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(metric.value / metric.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-6">🔄 Активность</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Активные соединения</span>
                    <span className="text-2xl font-bold text-black">{realTimeMetrics.activeConnections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Запросов в секунду</span>
                    <span className="text-2xl font-bold text-black">{realTimeMetrics.requestsPerSecond?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Коэффициент ошибок</span>
                    <span className="text-2xl font-bold text-green-600">{systemHealth.errorRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Нагрузка на сервер</span>
                    <span className="text-2xl font-bold text-black">{systemHealth.serverLoad}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uptime Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">📊 История работы (30 дней)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[90, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      color: 'black',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="uptime" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'servers' && (
          <motion.div
            key="servers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {serverMetrics.map((server) => (
                <div key={server.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">{server.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                      {getStatusText(server.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Время работы</span>
                      <span className="font-medium text-black">{server.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CPU</span>
                      <span className="font-medium text-black">{server.cpu}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Память</span>
                      <span className="font-medium text-black">{server.memory}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Среднее время отклика</span>
                      <span className="font-medium text-black">{server.avgResponse}ms</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Последняя проверка: {server.lastCheck.toLocaleTimeString('ru-RU')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">🔔 Активные уведомления</h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${
                    alert.acknowledged ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getAlertIcon(alert.type)}</span>
                        <div>
                          <h4 className="font-semibold text-black">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {alert.timestamp.toLocaleString('ru-RU')} • {alert.source}
                          </div>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-900 transition-colors"
                        >
                          Подтвердить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">📝 Журнал событий</h3>
              <div className="space-y-3">
                {errorLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <span className="text-lg">{getLevelIcon(log.level)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-black">{log.message}</span>
                        {log.count > 1 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {log.count}x
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {log.timestamp.toLocaleString('ru-RU')} • {log.source}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.resolved ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                      {log.resolved ? 'Решено' : 'Активно'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MonitoringView;