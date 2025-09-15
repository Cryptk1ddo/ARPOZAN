import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingCard = ({ icon: Icon, title, description, children }) => {
  return (
    <motion.div
      className="glass-card bg-white/5 border border-white/10 rounded-xl p-6"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
};

const ToggleSwitch = ({ enabled, onChange, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const SettingsPage = ({ user }) => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      orderAlerts: true,
      lowStockAlerts: true,
      weeklyReports: false
    },
    appearance: {
      theme: 'dark',
      language: 'ru',
      dateFormat: 'dd.mm.yyyy',
      currency: 'RUB'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    business: {
      storeName: 'ARPOZAN',
      storeEmail: 'admin@arpozan.com',
      storePhone: '+7 (800) 123-45-67',
      storeAddress: 'Москва, Россия',
      taxRate: 20,
      shippingCost: 0
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Настройки</h1>
          <p className="text-gray-400">Управление настройками администрирования</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="glow-button text-black font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          {isSaving ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{isSaving ? 'Сохранение...' : 'Сохранить изменения'}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <SettingCard
          icon={User}
          title="Профиль администратора"
          description="Управление данными администратора"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Роль
              </label>
              <input
                type="text"
                value="Супер администратор"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                readOnly
              />
            </div>
          </div>
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard
          icon={Bell}
          title="Уведомления"
          description="Настройка оповещений и уведомлений"
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.notifications.emailNotifications}
              onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              label="Email уведомления"
            />
            <ToggleSwitch
              enabled={settings.notifications.pushNotifications}
              onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              label="Push уведомления"
            />
            <ToggleSwitch
              enabled={settings.notifications.orderAlerts}
              onChange={(value) => updateSetting('notifications', 'orderAlerts', value)}
              label="Уведомления о новых заказах"
            />
            <ToggleSwitch
              enabled={settings.notifications.lowStockAlerts}
              onChange={(value) => updateSetting('notifications', 'lowStockAlerts', value)}
              label="Уведомления о низких остатках"
            />
            <ToggleSwitch
              enabled={settings.notifications.weeklyReports}
              onChange={(value) => updateSetting('notifications', 'weeklyReports', value)}
              label="Еженедельные отчеты"
            />
          </div>
        </SettingCard>

        {/* Appearance Settings */}
        <SettingCard
          icon={Palette}
          title="Внешний вид"
          description="Настройка темы и отображения"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Тема
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
                <option value="auto">Автоматически</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Язык
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Формат даты
              </label>
              <select
                value={settings.appearance.dateFormat}
                onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
                <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
                <option value="yyyy-mm-dd">ГГГГ-ММ-ДД</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Валюта
              </label>
              <select
                value={settings.appearance.currency}
                onChange={(e) => updateSetting('appearance', 'currency', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="RUB">Рубль (₽)</option>
                <option value="USD">Доллар ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {/* Security Settings */}
        <SettingCard
          icon={Shield}
          title="Безопасность"
          description="Настройки безопасности и авторизации"
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.security.twoFactorAuth}
              onChange={(value) => updateSetting('security', 'twoFactorAuth', value)}
              label="Двухфакторная аутентификация"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Таймаут сессии (минуты)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Срок действия пароля (дни)
                </label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Business Settings */}
        <SettingCard
          icon={Globe}
          title="Настройки магазина"
          description="Основные параметры интернет-магазина"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название магазина
              </label>
              <input
                type="text"
                value={settings.business.storeName}
                onChange={(e) => updateSetting('business', 'storeName', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email магазина
              </label>
              <input
                type="email"
                value={settings.business.storeEmail}
                onChange={(e) => updateSetting('business', 'storeEmail', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={settings.business.storePhone}
                onChange={(e) => updateSetting('business', 'storePhone', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Адрес
              </label>
              <input
                type="text"
                value={settings.business.storeAddress}
                onChange={(e) => updateSetting('business', 'storeAddress', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Налоговая ставка (%)
              </label>
              <input
                type="number"
                value={settings.business.taxRate}
                onChange={(e) => updateSetting('business', 'taxRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Стоимость доставки (₽)
              </label>
              <input
                type="number"
                value={settings.business.shippingCost}
                onChange={(e) => updateSetting('business', 'shippingCost', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </SettingCard>

        {/* System Info */}
        <SettingCard
          icon={Database}
          title="Информация о системе"
          description="Техническая информация"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Версия панели</h4>
              <p className="text-gray-400">v2.1.0</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Последнее обновление</h4>
              <p className="text-gray-400">15.09.2025</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Статус системы</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-green-400">Активна</p>
              </div>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};

export default SettingsPage;