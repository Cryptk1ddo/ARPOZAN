import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Icon = ({ path, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const HelpDocumentationSystem = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(['getting-started']);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const searchInputRef = useRef(null);

  // Documentation structure
  const documentation = {
    'getting-started': {
      title: 'Начало работы',
      icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.927 14.927 0 00-5.84 2.58m0 0a6 6 0 105.84 10.56 14.926 14.926 0 01-5.84-10.56',
      content: {
        overview: {
          title: 'Обзор системы',
          content: `
# Добро пожаловать в панель управления ARPOZAN

Эта административная панель предназначена для управления всеми аспектами вашего интернет-магазина пищевых добавок.

## Основные возможности:

- **Аналитика и отчеты** - Отслеживание продаж, конверсии и поведения клиентов
- **Управление заказами** - Обработка заказов от создания до доставки
- **Управление товарами** - Добавление, редактирование и управление каталогом
- **Работа с клиентами** - Управление базой клиентов и их данными
- **Система уведомлений** - Настройка и отправка уведомлений
- **Резервное копирование** - Экспорт и восстановление данных

## Быстрый старт:

1. Ознакомьтесь с главной панелью (Dashboard)
2. Настройте уведомления в разделе "Настройки"
3. Добавьте первые товары в каталог
4. Настройте способы доставки и оплаты
          `
        },
        navigation: {
          title: 'Навигация по интерфейсу',
          content: `
# Навигация по панели управления

## Главное меню
Расположено в левой части экрана и содержит все основные разделы:

- **Dashboard** - Главная страница с аналитикой
- **Заказы** - Управление заказами
- **Товары** - Каталог товаров
- **Клиенты** - База клиентов
- **Аналитика** - Детальные отчеты
- **Настройки** - Конфигурация системы

## Верхняя панель
- **Поиск** - Глобальный поиск по всей системе
- **Уведомления** - Новые уведомления и сообщения
- **Профиль** - Настройки аккаунта и выход

## Горячие клавиши
- \`Ctrl + K\` - Открыть поиск
- \`Ctrl + /\` - Показать справку
- \`Esc\` - Закрыть модальные окна
          `
        }
      }
    },
    'orders': {
      title: 'Управление заказами',
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      content: {
        overview: {
          title: 'Обзор заказов',
          content: `
# Управление заказами

Раздел заказов позволяет отслеживать и управлять всеми заказами клиентов.

## Статусы заказов:

- **Ожидает обработки** - Новый заказ, требует подтверждения
- **В обработке** - Заказ подтвержден, готовится к отправке
- **Отправлен** - Заказ передан в службу доставки
- **Выполнен** - Заказ успешно доставлен
- **Отменен** - Заказ отменен по различным причинам

## Основные действия:

1. **Просмотр деталей** - Полная информация о заказе
2. **Изменение статуса** - Обновление статуса заказа
3. **Уведомление клиента** - Отправка уведомлений о статусе
4. **Печать документов** - Генерация накладных и документов
          `
        },
        filtering: {
          title: 'Поиск и фильтрация',
          content: `
# Поиск и фильтрация заказов

## Быстрый поиск
Используйте строку поиска для быстрого поиска по:
- Номеру заказа
- Имени клиента
- Email клиента
- Телефону клиента
- Адресу доставки

## Расширенная фильтрация
Нажмите кнопку "Фильтры" для доступа к дополнительным опциям:

### Фильтры по статусу:
- Все заказы
- Только новые
- В обработке
- Отправленные
- Выполненные
- Отмененные

### Фильтры по дате:
- Сегодня
- Вчера
- Последние 7 дней
- Последний месяц
- Произвольный период

### Фильтры по сумме:
- Диапазон суммы заказа
- Способ оплаты
- Статус оплаты

## Сохраненные фильтры
Сохраняйте часто используемые комбинации фильтров для быстрого доступа.
          `
        }
      }
    },
    'products': {
      title: 'Управление товарами',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
      content: {
        overview: {
          title: 'Управление каталогом',
          content: `
# Управление товарами

Раздел товаров позволяет управлять каталогом продукции.

## Основные функции:

- **Добавление товаров** - Создание новых позиций
- **Редактирование** - Изменение информации о товарах
- **Управление остатками** - Контроль складских запасов
- **Ценообразование** - Установка цен и скидок
- **SEO-оптимизация** - Настройка мета-тегов и URL

## Структура товара:

### Основная информация:
- Название товара
- Артикул/SKU
- Категория
- Бренд
- Краткое описание

### Детальная информация:
- Полное описание
- Технические характеристики
- Состав и применение
- Противопоказания

### Медиа:
- Основное изображение
- Дополнительные фотографии
- Видео (если необходимо)

### Цены и остатки:
- Цена
- Цена со скидкой
- Количество на складе
- Минимальный остаток для уведомления
          `
        }
      }
    },
    'analytics': {
      title: 'Аналитика и отчеты',
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
      content: {
        overview: {
          title: 'Система аналитики',
          content: `
# Аналитика и отчеты

Раздел аналитики предоставляет детальную информацию о работе магазина.

## Доступные отчеты:

### Продажи:
- Общая выручка
- Продажи по периодам
- ТОП товаров
- Средний чек
- Конверсия

### Клиенты:
- Новые клиенты
- Повторные покупки
- Сегментация клиентов
- Географическое распределение

### Товары:
- Популярные товары
- Товары с низкими продажами
- Остатки на складе
- Анализ категорий

### Маркетинг:
- Источники трафика
- Эффективность рекламных кампаний
- ROI по каналам
- Сезонность продаж

## AI-инсайты:
Система автоматически анализирует данные и предоставляет рекомендации:
- Оптимизация ассортимента
- Ценовая стратегия
- Планирование закупок
- Маркетинговые рекомендации
          `
        }
      }
    },
    'settings': {
      title: 'Настройки системы',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      content: {
        overview: {
          title: 'Конфигурация системы',
          content: `
# Настройки системы

## Основные разделы настроек:

### Общие настройки:
- Название магазина
- Контактная информация
- Часовой пояс
- Валюта
- Язык интерфейса

### Уведомления:
- Email уведомления
- Push уведомления
- SMS уведомления
- Настройки тишины

### Доставка и оплата:
- Способы доставки
- Тарифы доставки
- Способы оплаты
- Настройки платежных систем

### Безопасность:
- Двухфакторная аутентификация
- Логи действий
- Права доступа
- Резервное копирование

### Интеграции:
- Платежные системы
- Службы доставки
- CRM системы
- Аналитические системы
          `
        }
      }
    },
    'troubleshooting': {
      title: 'Решение проблем',
      icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
      content: {
        common: {
          title: 'Частые проблемы',
          content: `
# Решение частых проблем

## Проблемы с загрузкой данных:

### Симптомы:
- Медленная загрузка страниц
- Ошибки при загрузке данных
- Пустые таблицы или списки

### Решения:
1. Обновите страницу (F5)
2. Очистите кеш браузера
3. Проверьте интернет-соединение
4. Обратитесь к администратору

## Проблемы с сохранением:

### Симптомы:
- Данные не сохраняются
- Ошибки при отправке форм
- Потеря несохраненных данных

### Решения:
1. Проверьте заполнение всех обязательных полей
2. Убедитесь, что файлы не превышают максимальный размер
3. Попробуйте сохранить еще раз
4. Скопируйте данные перед повторной попыткой

## Проблемы с доступом:

### Симптомы:
- Ошибки авторизации
- Отсутствие доступа к разделам
- Сброс сессии

### Решения:
1. Войдите в систему заново
2. Проверьте права доступа
3. Обратитесь к администратору
4. Очистите cookies браузера
          `
        }
      }
    }
  };

  // Onboarding steps
  const onboardingSteps = [
    {
      title: 'Добро пожаловать!',
      content: 'Давайте познакомимся с основными возможностями панели управления ARPOZAN.',
      target: '.dashboard-main'
    },
    {
      title: 'Навигация',
      content: 'Используйте боковое меню для перехода между разделами. Все основные функции доступны отсюда.',
      target: '.sidebar'
    },
    {
      title: 'Поиск и фильтры',
      content: 'Используйте поиск и фильтры для быстрого нахождения нужной информации.',
      target: '.search-filters'
    },
    {
      title: 'Уведомления',
      content: 'Следите за важными событиями через центр уведомлений.',
      target: '.notifications'
    },
    {
      title: 'Настройки',
      content: 'В настройках можно настроить систему под ваши потребности.',
      target: '.settings'
    }
  ];

  // Filter documentation based on search query
  const filteredDocs = React.useMemo(() => {
    if (!searchQuery.trim()) return documentation;
    
    const filtered = {};
    Object.entries(documentation).forEach(([key, section]) => {
      const matchesTitle = section.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesContent = Object.values(section.content).some(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchesTitle || matchesContent) {
        filtered[key] = section;
      }
    });
    
    return filtered;
  }, [searchQuery]);

  const toggleExpanded = (sectionId) => {
    setExpandedItems(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
    setOnboardingStep(0);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      setOnboardingStep(0);
    }
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingStep(0);
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSection = documentation[activeSection];
  const currentContent = currentSection?.content[Object.keys(currentSection.content)[0]];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 bg-white rounded-xl shadow-2xl z-50 flex flex-col max-h-[calc(100vh-2rem)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black rounded-lg">
              <Icon path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Справка и документация</h1>
              <p className="text-sm text-gray-500">Руководство по использованию системы</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={startOnboarding}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Обучение
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск в документации..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Object.entries(filteredDocs).map(([sectionId, section]) => (
                  <div key={sectionId}>
                    <button
                      onClick={() => {
                        setActiveSection(sectionId);
                        toggleExpanded(sectionId);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeSection === sectionId 
                          ? 'bg-black text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon path={section.icon} className="w-4 h-4" />
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <Icon 
                        path={expandedItems.includes(sectionId) 
                          ? "M19.5 8.25l-7.5 7.5-7.5-7.5" 
                          : "M8.25 4.5l7.5 7.5-7.5 7.5"
                        } 
                        className="w-4 h-4" 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expandedItems.includes(sectionId) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-7 mt-2 space-y-1">
                            {Object.entries(section.content).map(([contentId, content]) => (
                              <button
                                key={contentId}
                                onClick={() => setActiveSection(sectionId)}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                              >
                                {content.title}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {currentContent && (
              <div className="p-8">
                <div className="prose prose-gray max-w-none">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: currentContent.content
                        .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6">$1</h1>')
                        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
                        .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
                        .replace(/^\*\*(.+)\*\*$/gm, '<p class="font-semibold text-gray-900 mt-4 mb-2">$1</p>')
                        .replace(/^- (.+)$/gm, '<li class="text-gray-700 mb-1">$1</li>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
                        .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
                        .replace(/^(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Горячие клавиши:</span>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd>
                <span>поиск</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                <span>закрыть</span>
              </div>
            </div>
            <div>
              Версия системы: 2.1.0
            </div>
          </div>
        </div>
      </motion.div>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md mx-4 text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon path="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.927 14.927 0 00-5.84 2.58m0 0a6 6 0 105.84 10.56 14.926 14.926 0 01-5.84-10.56" className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {onboardingSteps[onboardingStep].title}
                </h3>
                <p className="text-gray-600">
                  {onboardingSteps[onboardingStep].content}
                </p>
              </div>

              <div className="flex items-center justify-center mb-6">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 ${
                      index === onboardingStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={skipOnboarding}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Пропустить
                </button>
                <button
                  onClick={nextOnboardingStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {onboardingStep === onboardingSteps.length - 1 ? 'Завершить' : 'Далее'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpDocumentationSystem;