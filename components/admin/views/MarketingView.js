import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Icon from '../shared/Icon';

const MarketingView = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(true);
  const [marketingMetrics, setMarketingMetrics] = useState({});
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);

  // Mock marketing data
  useEffect(() => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Летняя распродажа 2025',
        type: 'email',
        status: 'active',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-30'),
        budget: 150000,
        spent: 89000,
        target: 'all_customers',
        reach: 2400,
        impressions: 15600,
        clicks: 780,
        conversions: 156,
        revenue: 468000,
        ctr: 5.0,
        cpc: 114,
        roas: 5.26,
        description: 'Крупная летняя кампания со скидками до 30%',
        products: ['TONGKAT ALI', 'MACA', 'ULTIMATE PACK'],
        channels: ['email', 'social', 'display']
      },
      {
        id: 2,
        name: 'Ретаргетинг неактивных',
        type: 'retargeting',
        status: 'active',
        startDate: new Date('2025-09-10'),
        endDate: new Date('2025-10-10'),
        budget: 75000,
        spent: 23000,
        target: 'inactive_customers',
        reach: 890,
        impressions: 4200,
        clicks: 210,
        conversions: 42,
        revenue: 126000,
        ctr: 5.0,
        cpc: 110,
        roas: 5.48,
        description: 'Возврат неактивных клиентов персональными предложениями',
        products: ['YOHIMBINE', 'ZINC'],
        channels: ['email', 'sms']
      },
      {
        id: 3,
        name: 'Запуск ULTIMATE PACK',
        type: 'product_launch',
        status: 'completed',
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-09-15'),
        budget: 200000,
        spent: 195000,
        target: 'premium_customers',
        reach: 1200,
        impressions: 8900,
        clicks: 534,
        conversions: 89,
        revenue: 712000,
        ctr: 6.0,
        cpc: 365,
        roas: 3.65,
        description: 'Премиум запуск нового комбо-продукта',
        products: ['ULTIMATE PACK'],
        channels: ['email', 'social', 'influencer']
      }
    ];

    const mockEmailTemplates = [
      {
        id: 1,
        name: 'Добро пожаловать',
        type: 'welcome',
        subject: 'Добро пожаловать в ARPOZAN! 🚀',
        openRate: 78.5,
        clickRate: 12.3,
        status: 'active',
        lastModified: new Date('2025-09-10')
      },
      {
        id: 2,
        name: 'Брошенная корзина',
        type: 'abandoned_cart',
        subject: 'Не забудьте о своих товарах! 🛒',
        openRate: 65.2,
        clickRate: 18.7,
        status: 'active',
        lastModified: new Date('2025-09-08')
      },
      {
        id: 3,
        name: 'Рекомендации',
        type: 'recommendations',
        subject: 'Специально для вас: персональные рекомендации',
        openRate: 54.1,
        clickRate: 9.8,
        status: 'active',
        lastModified: new Date('2025-09-05')
      }
    ];

    const mockAutomationRules = [
      {
        id: 1,
        name: 'Серия писем новичкам',
        trigger: 'user_registration',
        status: 'active',
        emails: 5,
        delay: '1 день между письмами',
        performance: 'Конверсия 15.2%'
      },
      {
        id: 2,
        name: 'Реактивация неактивных',
        trigger: '30 дней без покупок',
        status: 'active',
        emails: 3,
        delay: '7 дней между письмами',
        performance: 'Возврат 23.8%'
      },
      {
        id: 3,
        name: 'Post-purchase follow-up',
        trigger: 'order_completed',
        status: 'active',
        emails: 4,
        delay: '3,7,14,30 дней после покупки',
        performance: 'Повторные покупки +45%'
      }
    ];

    const mockSegments = [
      { name: 'VIP клиенты', count: 156, growth: '+12%', color: '#000000' },
      { name: 'Новички', count: 324, growth: '+25%', color: '#404040' },
      { name: 'Постоянные', count: 198, growth: '+8%', color: '#808080' },
      { name: 'Неактивные', count: 89, growth: '-15%', color: '#C0C0C0' }
    ];

    const mockPerformance = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockPerformance.push({
        date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        impressions: Math.round(800 + Math.random() * 400),
        clicks: Math.round(40 + Math.random() * 30),
        conversions: Math.round(5 + Math.random() * 10),
        revenue: Math.round(15000 + Math.random() * 10000)
      });
    }

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setEmailTemplates(mockEmailTemplates);
      setAutomationRules(mockAutomationRules);
      setCustomerSegments(mockSegments);
      setCampaignPerformance(mockPerformance);
      setMarketingMetrics({
        totalSpent: 307000,
        totalRevenue: 1306000,
        avgRoas: 4.25,
        activeAudience: 3500,
        totalImpressions: 28700,
        totalClicks: 1524,
        avgCtr: 5.3,
        avgCpc: 201
      });
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'completed': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'draft': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'completed': return 'Завершена';
      case 'paused': return 'Приостановлена';
      case 'draft': return 'Черновик';
      default: return status;
    }
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
            📢 Маркетинг и автоматизация
          </h1>
          <p className="text-gray-600 mt-1">
            Управление кампаниями, автоматизация и аналитика маркетинга
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors border border-black"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
            Создать кампанию
          </button>
        </div>
      </div>

      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            name: 'Общие затраты', 
            value: formatCurrency(marketingMetrics.totalSpent), 
            icon: '💰',
            change: '+8.5%',
            trend: 'up'
          },
          { 
            name: 'Доход от маркетинга', 
            value: formatCurrency(marketingMetrics.totalRevenue), 
            icon: '📈',
            change: '+15.2%',
            trend: 'up'
          },
          { 
            name: 'Средний ROAS', 
            value: `${marketingMetrics.avgRoas}x`, 
            icon: '🎯',
            change: '+0.3x',
            trend: 'up'
          },
          { 
            name: 'Активная аудитория', 
            value: marketingMetrics.activeAudience?.toLocaleString(), 
            icon: '👥',
            change: '+12%',
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
            { id: 'campaigns', name: 'Кампании', icon: '📢' },
            { id: 'automation', name: 'Автоматизация', icon: '🤖' },
            { id: 'templates', name: 'Шаблоны', icon: '📧' },
            { id: 'segments', name: 'Сегменты', icon: '👥' },
            { id: 'analytics', name: 'Аналитика', icon: '📊' }
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
        {activeTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  layoutId={`campaign-${campaign.id}`}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-1">
                        {campaign.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">ROAS</div>
                      <div className="text-lg font-bold text-black">{campaign.roas}x</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Бюджет</span>
                      <span className="font-medium text-black">{formatCurrency(campaign.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Потрачено</span>
                      <span className="font-medium text-black">{formatCurrency(campaign.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Доход</span>
                      <span className="font-medium text-green-600">{formatCurrency(campaign.revenue)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Прогресс бюджета</span>
                        <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">CTR</div>
                        <div className="font-semibold text-black">{campaign.ctr}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Конверсии</div>
                        <div className="font-semibold text-black">{campaign.conversions}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Охват</div>
                        <div className="font-semibold text-black">{campaign.reach.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'automation' && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">🤖 Правила автоматизации</h3>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-black">{rule.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        Триггер: {rule.trigger} • {rule.emails} писем • {rule.delay}
                      </div>
                      <div className="text-sm text-green-600 mt-1 font-medium">
                        {rule.performance}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {getStatusText(rule.status)}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Icon path="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Campaign Performance Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">📊 Эффективность кампаний</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      color: 'black',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="impressions" stackId="2" stroke="#666666" fill="#666666" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Segments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-6">👥 Сегменты аудитории</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {customerSegments.map((segment) => (
                  <div key={segment.name} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: segment.color }}>
                      <span className="text-white font-bold">{segment.count}</span>
                    </div>
                    <h4 className="font-semibold text-black text-sm">{segment.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{segment.growth}</p>
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

export default MarketingView;