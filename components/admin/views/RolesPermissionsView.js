import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';

const RolesPermissionsView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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
        lastActive: new Date('2025-09-16T14:30:00'),
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
        lastActive: new Date('2025-09-16T13:45:00'),
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
        lastActive: new Date('2025-09-16T12:15:00'),
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
        lastActive: new Date('2025-09-10T16:20:00'),
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
        lastActive: new Date('2025-09-16T11:30:00'),
        createdAt: new Date('2024-05-12'),
        loginCount: 445,
        department: 'Аналитика'
      }
    ];

    setTimeout(() => {
      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.id === parseInt(filterRole);
    return matchesSearch && matchesRole;
  });

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

  const groupPermissionsByCategory = () => {
    const grouped = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const deleteUser = (userId) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const deleteRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.system) {
      alert('Системную роль нельзя удалить');
      return;
    }
    if (role?.userCount > 0) {
      alert('Нельзя удалить роль, которая назначена пользователям');
      return;
    }
    if (confirm('Вы уверены, что хотите удалить эту роль?')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
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
            👥 Роли и права доступа
          </h1>
          <p className="text-gray-600 mt-1">
            Управление пользователями, ролями и правами доступа к системе
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {activeTab === 'users' && (
            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors border border-black"
            >
              <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
              Добавить пользователя
            </button>
          )}
          {activeTab === 'roles' && (
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors border border-black"
            >
              <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
              Создать роль
            </button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Всего пользователей', value: users.length, icon: '👥', change: '+2' },
          { name: 'Активных пользователей', value: users.filter(u => u.status === 'active').length, icon: '✅', change: '+1' },
          { name: 'Ролей в системе', value: roles.length, icon: '🛡️', change: '0' },
          { name: 'Прав доступа', value: permissions.length, icon: '🔐', change: '+3' }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-black text-white">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.name}</h3>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'users', name: 'Пользователи', icon: '👥' },
            { id: 'roles', name: 'Роли', icon: '🛡️' },
            { id: 'permissions', name: 'Права доступа', icon: '🔐' },
            { id: 'audit', name: 'Аудит', icon: '📋' }
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
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="all">Все роли</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Пользователь</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Роль</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Статус</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Последняя активность</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Отдел</th>
                      <th className="text-center py-3 px-6 font-medium text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-700">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-black">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role.color)}`}>
                            {user.role.name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {user.lastActive.toLocaleString('ru-RU')}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {user.department}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              title="Редактировать"
                            >
                              <Icon path="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0V9a2 2 0 012-2h4m10-2h6m0 0v6m0-6L10 11" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              title={user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                            >
                              <Icon path={user.status === 'active' ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                              title="Удалить"
                            >
                              <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roles' && (
          <motion.div
            key="roles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-1">{role.name}</h3>
                      {role.system && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Системная роль
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRole(role)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Редактировать"
                      >
                        <Icon path="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0V9a2 2 0 012-2h4m10-2h6m0 0v6m0-6L10 11" className="w-4 h-4" />
                      </button>
                      {!role.system && (
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                          title="Удалить"
                        >
                          <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Пользователей</span>
                      <span className="font-medium text-black">{role.userCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Прав доступа</span>
                      <span className="font-medium text-black">{role.permissions.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Основные права:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(permId => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <span key={permId} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                            {perm.name.split(' ')[0]}
                          </span>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          +{role.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'permissions' && (
          <motion.div
            key="permissions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Permissions by Category */}
            {Object.entries(groupPermissionsByCategory()).map(([category, perms]) => (
              <div key={category} className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {perms.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="p-2 bg-black text-white rounded">
                        <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-black text-sm">{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RolesPermissionsView;