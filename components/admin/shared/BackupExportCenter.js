import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

const BackupExportCenter = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [exportData, setExportData] = useState({
    orders: true,
    customers: true,
    products: true,
    analytics: false,
    settings: false
  });
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [backups, setBackups] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Generate mock backup history
  useEffect(() => {
    const mockBackups = [
      {
        id: 1,
        name: 'Автоматический бэкап',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        size: '15.2 MB',
        type: 'auto',
        status: 'completed',
        includes: ['orders', 'customers', 'products', 'settings']
      },
      {
        id: 2,
        name: 'Ручной бэкап перед обновлением',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: '14.8 MB',
        type: 'manual',
        status: 'completed',
        includes: ['orders', 'customers', 'products', 'analytics', 'settings']
      },
      {
        id: 3,
        name: 'Еженедельный бэкап',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: '13.9 MB',
        type: 'scheduled',
        status: 'completed',
        includes: ['orders', 'customers', 'products']
      },
      {
        id: 4,
        name: 'Месячный архив',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        size: '42.3 MB',
        type: 'archive',
        status: 'completed',
        includes: ['orders', 'customers', 'products', 'analytics', 'settings', 'logs']
      }
    ];
    setBackups(mockBackups);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    const exportSteps = [
      'Подготовка данных...',
      'Фильтрация по датам...',
      'Формирование отчета...',
      'Генерация файла...',
      'Завершение экспорта...'
    ];

    for (let i = 0; i < exportSteps.length; i++) {
      if (window.toast) {
        window.toast.info(exportSteps[i], 'Экспорт данных');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate file download
    const selectedData = Object.entries(exportData)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    
    const fileName = `arpozan_export_${dateRange.from}_${dateRange.to}.${exportFormat}`;
    
    if (window.toast) {
      window.toast.success(
        `Экспорт завершен: ${selectedData.length} таблиц`, 
        'Экспорт готов',
        {
          action: {
            label: 'Скачать',
            callback: () => {
              // Create and download a dummy file
              const blob = new Blob(['Export data would be here'], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              a.click();
              URL.revokeObjectURL(url);
            }
          }
        }
      );
    }

    setIsExporting(false);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    
    const backupSteps = [
      'Инициализация бэкапа...',
      'Копирование базы данных...',
      'Архивирование файлов...',
      'Создание контрольных сумм...',
      'Сохранение бэкапа...'
    ];

    for (let i = 0; i < backupSteps.length; i++) {
      if (window.toast) {
        window.toast.info(backupSteps[i], 'Создание бэкапа');
      }
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Add new backup to the list
    const newBackup = {
      id: Date.now(),
      name: 'Ручной бэкап',
      date: new Date(),
      size: '15.7 MB',
      type: 'manual',
      status: 'completed',
      includes: Object.entries(exportData)
        .filter(([key, value]) => value)
        .map(([key]) => key)
    };

    setBackups(prev => [newBackup, ...prev]);

    if (window.toast) {
      window.toast.success('Бэкап успешно создан', 'Бэкап готов');
    }

    setIsBackingUp(false);
  };

  const downloadBackup = (backup) => {
    if (window.toast) {
      window.toast.info(`Скачивание бэкапа: ${backup.name}`, 'Загрузка');
    }
    
    // Simulate download
    setTimeout(() => {
      const blob = new Blob(['Backup data would be here'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backup.id}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const restoreBackup = (backup) => {
    if (window.toast) {
      window.toast.warning(
        'Восстановление приведет к потере текущих данных. Продолжить?',
        'Подтверждение восстановления',
        {
          action: {
            label: 'Восстановить',
            callback: async () => {
              window.toast.info('Начинается восстановление из бэкапа...', 'Восстановление');
              await new Promise(resolve => setTimeout(resolve, 3000));
              window.toast.success('Данные успешно восстановлены', 'Восстановление завершено');
            }
          }
        }
      );
    }
  };

  const deleteBackup = (backupId) => {
    setBackups(prev => prev.filter(backup => backup.id !== backupId));
    if (window.toast) {
      window.toast.info('Бэкап удален', 'Удаление');
    }
  };

  const getBackupIcon = (type) => {
    switch (type) {
      case 'auto':
        return '🤖';
      case 'manual':
        return '👤';
      case 'scheduled':
        return '⏰';
      case 'archive':
        return '📦';
      default:
        return '💾';
    }
  };

  const getDataTypeLabel = (key) => {
    const labels = {
      orders: 'Заказы',
      customers: 'Клиенты',
      products: 'Товары',
      analytics: 'Аналитика',
      settings: 'Настройки',
      logs: 'Логи'
    };
    return labels[key] || key;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg">
                  <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Резервное копирование и экспорт</h2>
                  <p className="text-sm text-gray-600">Управление данными и создание резервных копий</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              {[
                { id: 'export', label: 'Экспорт данных', icon: '📊' },
                { id: 'backup', label: 'Резервные копии', icon: '💾' },
                { id: 'schedule', label: 'Расписание', icon: '⏰' },
                { id: 'settings', label: 'Настройки', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
            <AnimatePresence mode="wait">
              {activeTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Data Selection */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-4">Выберите данные для экспорта</h3>
                        <div className="space-y-3">
                          {Object.entries(exportData).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="font-medium text-black">{getDataTypeLabel(key)}</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => setExportData(prev => ({ ...prev, [key]: e.target.checked }))}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-black mb-4">Период данных</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">От</label>
                            <input
                              type="date"
                              value={dateRange.from}
                              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">До</label>
                            <input
                              type="date"
                              value={dateRange.to}
                              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export Settings */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-4">Формат экспорта</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'xlsx', label: 'Excel (.xlsx)', icon: '📊', desc: 'Подходит для анализа' },
                            { value: 'csv', label: 'CSV (.csv)', icon: '📝', desc: 'Универсальный формат' },
                            { value: 'json', label: 'JSON (.json)', icon: '🔧', desc: 'Для разработчиков' },
                            { value: 'pdf', label: 'PDF (.pdf)', icon: '📄', desc: 'Для печати' }
                          ].map((format) => (
                            <button
                              key={format.value}
                              onClick={() => setExportFormat(format.value)}
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                exportFormat === format.value
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <div className="text-lg mb-1">{format.icon}</div>
                              <div className="font-medium text-sm">{format.label}</div>
                              <div className={`text-xs ${exportFormat === format.value ? 'text-gray-300' : 'text-gray-500'}`}>
                                {format.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-black mb-2">📋 Информация об экспорте</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Таблицы: {Object.values(exportData).filter(Boolean).length}</div>
                          <div>Период: {dateRange.from} - {dateRange.to}</div>
                          <div>Формат: {exportFormat.toUpperCase()}</div>
                          <div>Примерный размер: ~2.5 MB</div>
                        </div>
                      </div>

                      <button
                        onClick={handleExport}
                        disabled={isExporting || Object.values(exportData).every(v => !v)}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        {isExporting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Экспортируем...</span>
                          </>
                        ) : (
                          <>
                            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5" />
                            <span>Начать экспорт</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'backup' && (
                <motion.div
                  key="backup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-black">История резервных копий</h3>
                    <button
                      onClick={handleBackup}
                      disabled={isBackingUp}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isBackingUp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Создаем бэкап...</span>
                        </>
                      ) : (
                        <>
                          <Icon path="M12 4v12m8-8l-4-4-4 4" className="w-4 h-4" />
                          <span>Создать бэкап</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {backups.map((backup, index) => (
                      <motion.div
                        key={backup.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{getBackupIcon(backup.type)}</div>
                            <div>
                              <h4 className="font-semibold text-black">{backup.name}</h4>
                              <div className="text-sm text-gray-600 space-x-4">
                                <span>{backup.date.toLocaleDateString('ru-RU')} {backup.date.toLocaleTimeString('ru-RU')}</span>
                                <span>•</span>
                                <span>{backup.size}</span>
                                <span>•</span>
                                <span className="capitalize">{backup.type === 'auto' ? 'Автоматический' : backup.type === 'manual' ? 'Ручной' : backup.type === 'scheduled' ? 'По расписанию' : 'Архив'}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {backup.includes.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                  >
                                    {getDataTypeLabel(item)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => downloadBackup(backup)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Скачать"
                            >
                              <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => restoreBackup(backup)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Восстановить"
                            >
                              <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteBackup(backup.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-semibold text-black mb-6">Автоматическое резервное копирование</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-black">Ежедневный бэкап</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Создание ежедневной резервной копии в 03:00</p>
                        <div className="text-xs text-gray-500">Последний: Сегодня, 03:00</div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-black">Еженедельный бэкап</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Полный бэкап каждое воскресенье в 02:00</p>
                        <div className="text-xs text-gray-500">Последний: 3 дня назад</div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-black">Месячный архив</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Архивирование данных в первый день месяца</p>
                        <div className="text-xs text-gray-500">Отключено</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-black mb-3">📊 Статистика бэкапов</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Всего бэкапов:</span>
                            <span className="font-medium text-black">24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Общий размер:</span>
                            <span className="font-medium text-black">342.1 MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Успешных:</span>
                            <span className="font-medium text-green-600">23 (95.8%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">С ошибками:</span>
                            <span className="font-medium text-red-600">1 (4.2%)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-black mb-3">⚠️ Рекомендации</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Включите месячный архив для долгосрочного хранения</li>
                          <li>• Проверяйте целостность бэкапов раз в неделю</li>
                          <li>• Храните копии в облачном хранилище</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6"
                >
                  <h3 className="text-lg font-semibold text-black mb-6">Настройки резервного копирования</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-black mb-4">Хранение бэкапов</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Максимальное количество бэкапов
                          </label>
                          <input
                            type="number"
                            defaultValue="30"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Срок хранения (дни)
                          </label>
                          <input
                            type="number"
                            defaultValue="90"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-4">Уведомления</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-black">Уведомлять об успешных бэкапах</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-black">Уведомлять об ошибках</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-4">Сжатие и шифрование</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-black font-medium">Сжатие бэкапов</span>
                            <div className="text-sm text-gray-600">Уменьшает размер файлов на ~60%</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-black font-medium">Шифрование AES-256</span>
                            <div className="text-sm text-gray-600">Защита конфиденциальных данных</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Последняя активность: {new Date().toLocaleString('ru-RU')}
              </p>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Закрыть
                </button>
                <button 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Сохранить настройки
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackupExportCenter;