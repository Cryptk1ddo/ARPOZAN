import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Icon Component
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);

// Simple Search Component
const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Icon 
      path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
    />
  </div>
);

// Filter Select Component
const FilterSelect = ({ value, onChange, options, label }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const RolesPermissionsView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock data
  useEffect(() => {
    const mockPermissions = [
      { id: 'dashboard_view', name: 'Просмотр панели управления', category: 'Панель управления' },
      { id: 'dashboard_edit', name: 'Редактирование панели управления', category: 'Панель управления' },
      { id: 'products_view', name: 'Просмотр продуктов', category: 'Продукты' },
      { id: 'products_create', name: 'Создание продуктов', category: 'Продукты' },
      { id: 'products_edit', name: 'Редактирование продуктов', category: 'Продукты' },
      { id: 'products_delete', name: 'Удаление продуктов', category: 'Продукты' },
      { id: 'orders_view', name: 'Просмотр заказов', category: 'Заказы' },
      { id: 'orders_edit', name: 'Редактирование заказов', category: 'Заказы' },
      { id: 'orders_cancel', name: 'Отмена заказов', category: 'Заказы' },
      { id: 'customers_view', name: 'Просмотр клиентов', category: 'Клиенты' },
      { id: 'customers_edit', name: 'Редактирование клиентов', category: 'Клиенты' },
      { id: 'customers_delete', name: 'Удаление клиентов', category: 'Клиенты' },
      { id: 'inventory_view', name: 'Просмотр склада', category: 'Склад' },
      { id: 'inventory_edit', name: 'Редактирование склада', category: 'Склад' },
      { id: 'marketing_view', name: 'Просмотр маркетинга', category: 'Маркетинг' },
      { id: 'marketing_create', name: 'Создание кампаний', category: 'Маркетинг' },
      { id: 'monitoring_view', name: 'Просмотр мониторинга', category: 'Мониторинг' },
      { id: 'reports_view', name: 'Просмотр отчетов', category: 'Отчеты' },
      { id: 'reports_export', name: 'Экспорт отчетов', category: 'Отчеты' },
      { id: 'settings_view', name: 'Просмотр настроек', category: 'Настройки' },
      { id: 'settings_edit', name: 'Редактирование настроек', category: 'Настройки' },
      { id: 'users_manage', name: 'Управление пользователями', category: 'Администрирование' },
      { id: 'roles_manage', name: 'Управление ролями', category: 'Администрирование' }
    ];

    const mockRoles = [
      {
        id: 1,
        name: 'Супер Администратор',
        description: 'Полный доступ ко всем функциям системы',
        permissions: mockPermissions.map(p => p.id),
        userCount: 2,
        color: 'red',
        system: true
      },
      {
        id: 2,
        name: 'Администратор',
        description: 'Доступ к большинству административных функций',
        permissions: mockPermissions.filter(p => !['users_manage', 'roles_manage'].includes(p.id)).map(p => p.id),
        userCount: 3,
        color: 'blue',
        system: false
      },
      {
        id: 3,
        name: 'Менеджер',
        description: 'Управление продуктами, заказами и клиентами',
        permissions: [
          'dashboard_view', 'products_view', 'products_edit', 'products_create',
          'orders_view', 'orders_edit', 'customers_view', 'customers_edit',
          'inventory_view', 'marketing_view', 'reports_view'
        ],
        userCount: 5,
        color: 'green',
        system: false
      },
      {
        id: 4,
        name: 'Оператор',
        description: 'Базовый доступ для обработки заказов',
        permissions: [
          'dashboard_view', 'orders_view', 'orders_edit',
          'customers_view', 'products_view', 'inventory_view'
        ],
        userCount: 8,
        color: 'yellow',
        system: false
      },
      {
        id: 5,
        name: 'Аналитик',
        description: 'Доступ к отчетам и аналитике',
        permissions: [
          'dashboard_view', 'reports_view', 'reports_export',
          'marketing_view', 'monitoring_view'
        ],
        userCount: 2,
        color: 'purple',
        system: false
      }
    ];

    const mockUsers = [
      {
        id: 1,
        name: 'Алексей Петров',
        email: 'alexey@arpozan.com',
        avatar: '/api/placeholder/40/40',
        role: mockRoles[0],
        status: 'active',
        lastActive: new Date('2025-01-17T14:30:00'),
        createdAt: new Date('2024-01-15'),
        loginCount: 1256,
        department: 'IT'
      },
      {
        id: 2,
        name: 'Мария Сидорова',
        email: 'maria@arpozan.com',
        avatar: '/api/placeholder/40/40',
        role: mockRoles[1],
        status: 'active',
        lastActive: new Date('2025-01-17T13:45:00'),
        createdAt: new Date('2024-02-20'),
        loginCount: 892,
        department: 'Продажи'
      },
      {
        id: 3,
        name: 'Дмитрий Козлов',
        email: 'dmitry@arpozan.com',
        avatar: '/api/placeholder/40/40',
        role: mockRoles[2],
        status: 'active',
        lastActive: new Date('2025-01-17T12:15:00'),
        createdAt: new Date('2024-03-10'),
        loginCount: 654,
        department: 'Склад'
      },
      {
        id: 4,
        name: 'Анна Волкова',
        email: 'anna@arpozan.com',
        avatar: '/api/placeholder/40/40',
        role: mockRoles[3],
        status: 'inactive',
        lastActive: new Date('2025-01-10T16:20:00'),
        createdAt: new Date('2024-04-05'),
        loginCount: 234,
        department: 'Поддержка'
      },
      {
        id: 5,
        name: 'Сергей Иванов',
        email: 'sergey@arpozan.com',
        avatar: '/api/placeholder/40/40',
        role: mockRoles[4],
        status: 'active',
        lastActive: new Date('2025-01-17T11:30:00'),
        createdAt: new Date('2024-05-12'),
        loginCount: 445,
        department: 'Аналитика'
      }
    ];

    setTimeout(() => {
      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setFilteredRoles(mockRoles);
      setLoading(false);
    }, 500);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                           user.department.toLowerCase().includes(userSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role.id.toString() === roleFilter;
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
    });
    
    setFilteredUsers(filtered);
  }, [users, userSearchTerm, statusFilter, roleFilter, departmentFilter]);

  // Filter roles based on search
  useEffect(() => {
    let filtered = roles.filter(role => {
      return role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
             role.description.toLowerCase().includes(roleSearchTerm.toLowerCase());
    });
    
    setFilteredRoles(filtered);
  }, [roles, roleSearchTerm]);

  // Analytics calculations
  const analytics = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRoles: roles.length,
    systemRoles: roles.filter(r => r.system).length,
    totalPermissions: permissions.length,
    avgPermissionsPerRole: roles.length > 0 ? (roles.reduce((sum, r) => sum + r.permissions.length, 0) / roles.length).toFixed(1) : 0,
    mostActiveUser: users.reduce((prev, current) => (prev.loginCount > current.loginCount) ? prev : current, users[0] || {}),
    recentLogins: users.filter(u => {
      const daysSinceLogin = (new Date() - new Date(u.lastActive)) / (1000 * 60 * 60 * 24);
      return daysSinceLogin <= 7;
    }).length
  };

  // Analytics data for charts
  const roleDistributionData = roles.map(role => ({
    name: role.name.split(' ')[0],
    value: role.userCount,
    color: `hsl(${role.id * 60}, 70%, 50%)`
  }));

  const userStatusData = [
    { name: 'Активные', value: analytics.activeUsers, fill: '#10b981' },
    { name: 'Неактивные', value: users.filter(u => u.status === 'inactive').length, fill: '#6b7280' },
    { name: 'Заблокированные', value: users.filter(u => u.status === 'suspended').length, fill: '#ef4444' }
  ];

  const permissionCategoryData = permissions.reduce((acc, perm) => {
    const category = perm.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(permissionCategoryData).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / permissions.length) * 100).toFixed(1)
  }));

  const monthlyActivityData = [
    { month: 'Янв', logins: 1245, newUsers: 12, roleChanges: 3 },
    { month: 'Фев', logins: 1567, newUsers: 18, roleChanges: 5 },
    { month: 'Мар', logins: 1890, newUsers: 25, roleChanges: 7 },
    { month: 'Апр', logins: 2123, newUsers: 20, roleChanges: 4 },
    { month: 'Май', logins: 1876, newUsers: 15, roleChanges: 6 },
    { month: 'Июн', logins: 2234, newUsers: 22, roleChanges: 8 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'suspended': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'suspended': return 'Заблокирован';
      default: return status;
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      red: 'text-red-600 bg-red-50 border-red-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[color] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role.name,
      department: user.department,
      status: getStatusText(user.status),
      loginCount: user.loginCount
    }));
    
    console.log('Exporting users:', csvData);
    alert('Экспорт пользователей (демо)');
  };

  const exportRoles = () => {
    const csvData = filteredRoles.map(role => ({
      name: role.name,
      description: role.description,
      userCount: role.userCount,
      permissionsCount: role.permissions.length
    }));
    
    console.log('Exporting roles:', csvData);
    alert('Экспорт ролей (демо)');
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
            👥 Роли и права доступа
          </h1>
          <p className="text-gray-600 mt-1">
            Управление пользователями, ролями и правами доступа к системе
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-4 h-4 mr-2" />
            Новая роль
          </button>
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" className="w-4 h-4 mr-2" />
            Новый пользователь
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Обзор', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'users', label: 'Пользователи', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
            { id: 'roles', label: 'Роли', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { id: 'analytics', label: 'Аналитика', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <Icon path={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Всего пользователей</p>
                    <p className="text-3xl font-bold text-blue-900">{analytics.totalUsers}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {analytics.activeUsers} активных
                    </p>
                  </div>
                  <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Всего ролей</p>
                    <p className="text-3xl font-bold text-green-900">{analytics.totalRoles}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {analytics.systemRoles} системных
                    </p>
                  </div>
                  <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Всего разрешений</p>
                    <p className="text-3xl font-bold text-purple-900">{analytics.totalPermissions}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      {analytics.avgPermissionsPerRole} на роль
                    </p>
                  </div>
                  <Icon path="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" className="w-8 h-8 text-purple-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Активность</p>
                    <p className="text-3xl font-bold text-yellow-900">{analytics.recentLogins}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      входов за неделю
                    </p>
                  </div>
                  <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-yellow-500" />
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-5 h-5 mr-2" />
                  Распределение по ролям
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 mr-2" />
                  Статус пользователей
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <SearchInput
                  value={userSearchTerm}
                  onChange={setUserSearchTerm}
                  placeholder="Поиск пользователей..."
                />
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  label="Статус"
                  options={[
                    { value: 'all', label: 'Все статусы' },
                    { value: 'active', label: 'Активные' },
                    { value: 'inactive', label: 'Неактивные' },
                    { value: 'suspended', label: 'Заблокированные' }
                  ]}
                />
                <FilterSelect
                  value={roleFilter}
                  onChange={setRoleFilter}
                  label="Роль"
                  options={[
                    { value: 'all', label: 'Все роли' },
                    ...roles.map(role => ({
                      value: role.id.toString(),
                      label: role.name
                    }))
                  ]}
                />
                <FilterSelect
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  label="Отдел"
                  options={[
                    { value: 'all', label: 'Все отделы' },
                    ...Array.from(new Set(users.map(u => u.department))).map(dept => ({
                      value: dept,
                      label: dept
                    }))
                  ]}
                />
                <div className="flex items-end">
                  <button
                    onClick={exportUsers}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Экспорт
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Показано {filteredUsers.length} из {users.length} пользователей
              </p>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Роль:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleColor(user.role.color)}`}>
                        {user.role.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Отдел:</span>
                      <span className="font-medium text-gray-900">{user.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Входов:</span>
                      <span className="font-medium text-gray-900">{user.loginCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Последний вход:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.lastActive).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Подробнее
                    </button>
                    <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Редактировать
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Search and Export */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <SearchInput
                    value={roleSearchTerm}
                    onChange={setRoleSearchTerm}
                    placeholder="Поиск ролей..."
                  />
                </div>
                <button
                  onClick={exportRoles}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Экспорт
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Показано {filteredRoles.length} из {roles.length} ролей
              </p>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    </div>
                    {role.system && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Системная
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Пользователей:</span>
                      <span className="font-semibold text-gray-900">{role.userCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Разрешений:</span>
                      <span className="font-semibold text-gray-900">{role.permissions.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Основные разрешения:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <span key={permId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {perm.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{role.permissions.length - 3} еще
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Подробнее
                    </button>
                    {!role.system && (
                      <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Редактировать
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение разрешений</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность пользователей</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="logins" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Аналитика безопасности</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{Math.round(analytics.recentLogins / analytics.totalUsers * 100)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Активность пользователей</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analytics.avgPermissionsPerRole}</div>
                  <div className="text-sm text-gray-600 mt-1">Среднее разрешений на роль</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{Math.round(analytics.systemRoles / analytics.totalRoles * 100)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Системных ролей</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <div className="text-gray-900">{selectedUser.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Отдел</label>
                      <div className="text-gray-900">{selectedUser.department}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Роль</label>
                      <div className="text-gray-900">{selectedUser.role.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Статус</label>
                      <div className="text-gray-900">{getStatusText(selectedUser.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Количество входов</label>
                      <div className="text-gray-900">{selectedUser.loginCount}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Последний вход</label>
                      <div className="text-gray-900">
                        {new Date(selectedUser.lastActive).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Разрешения роли</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.role.permissions.map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <div key={permId} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{perm.name}</div>
                              <div className="text-sm text-gray-600">{perm.category}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Detail Modal */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedRole.name}</h2>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Описание</label>
                    <div className="text-gray-900">{selectedRole.description}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Количество пользователей</label>
                      <div className="text-gray-900">{selectedRole.userCount}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Количество разрешений</label>
                      <div className="text-gray-900">{selectedRole.permissions.length}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Разрешения</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRole.permissions.map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <div key={permId} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{perm.name}</div>
                              <div className="text-sm text-gray-600">{perm.category}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RolesPermissionsView;