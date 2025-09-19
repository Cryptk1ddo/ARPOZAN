import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Icon = ({ path, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const SearchFilterSystem = ({ 
  data = [], 
  onFilteredData, 
  searchableFields = [], 
  filterConfig = {},
  sortConfig = {},
  viewType = 'table',
  placeholder = "Поиск...",
  showAdvancedFilters = true,
  showSortOptions = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState(sortConfig.defaultSort || '');
  const [sortDirection, setSortDirection] = useState(sortConfig.defaultDirection || 'asc');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const searchInputRef = useRef(null);

  // Process and filter data
  useEffect(() => {
    let filteredData = [...data];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(item => {
        return searchableFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(query);
        });
      });
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        filteredData = filteredData.filter(item => {
          const itemValue = getNestedValue(item, key);
          
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          
          if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
            const numValue = parseFloat(itemValue);
            return numValue >= value.min && numValue <= value.max;
          }
          
          if (typeof value === 'object' && value.start && value.end) {
            const itemDate = new Date(itemValue);
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            return itemDate >= startDate && itemDate <= endDate;
          }
          
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      filteredData.sort((a, b) => {
        const aValue = getNestedValue(a, sortBy);
        const bValue = getNestedValue(b, sortBy);
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    onFilteredData(filteredData);
  }, [data, searchQuery, activeFilters, sortBy, sortDirection, searchableFields, onFilteredData]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setSortBy(sortConfig.defaultSort || '');
    setSortDirection(sortConfig.defaultDirection || 'asc');
  };

  const saveCurrentFilter = () => {
    if (filterName.trim()) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        searchQuery,
        activeFilters,
        sortBy,
        sortDirection,
        createdAt: new Date().toISOString()
      };
      
      setSavedFilters(prev => [...prev, newFilter]);
      setFilterName('');
      setShowSaveDialog(false);
      
      // Show success toast
      if (window.toast) {
        window.toast.success(`Фильтр "${filterName}" сохранен`);
      }
    }
  };

  const loadSavedFilter = (filter) => {
    setSearchQuery(filter.searchQuery);
    setActiveFilters(filter.activeFilters);
    setSortBy(filter.sortBy);
    setSortDirection(filter.sortDirection);
    setIsAdvancedOpen(false);
    
    if (window.toast) {
      window.toast.success(`Фильтр "${filter.name}" применен`);
    }
  };

  const deleteSavedFilter = (filterId) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    
    if (window.toast) {
      window.toast.success('Фильтр удален');
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    count += Object.values(activeFilters).filter(value => 
      value && value !== '' && value !== 'all'
    ).length;
    return count;
  };

  const renderFilterControl = (key, config) => {
    const { type, label, options, min, max, step } = config;
    
    switch (type) {
      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
              value={activeFilters[key] || 'all'}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">Все</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'multiselect':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {options.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={activeFilters[key]?.includes(option.value) || false}
                    onChange={(e) => {
                      const currentValues = activeFilters[key] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleFilterChange(key, newValues.length ? newValues : null);
                    }}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
        
      case 'range':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="От"
                min={min}
                max={max}
                step={step}
                value={activeFilters[key]?.min || ''}
                onChange={(e) => {
                  const current = activeFilters[key] || {};
                  handleFilterChange(key, { ...current, min: parseFloat(e.target.value) || undefined });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <input
                type="number"
                placeholder="До"
                min={min}
                max={max}
                step={step}
                value={activeFilters[key]?.max || ''}
                onChange={(e) => {
                  const current = activeFilters[key] || {};
                  handleFilterChange(key, { ...current, max: parseFloat(e.target.value) || undefined });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        );
        
      case 'daterange':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={activeFilters[key]?.start || ''}
                onChange={(e) => {
                  const current = activeFilters[key] || {};
                  handleFilterChange(key, { ...current, start: e.target.value });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <input
                type="date"
                value={activeFilters[key]?.end || ''}
                onChange={(e) => {
                  const current = activeFilters[key] || {};
                  handleFilterChange(key, { ...current, end: e.target.value });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Icon 
              path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Active Filter Count */}
            {getActiveFilterCount() > 0 && (
              <span className="px-3 py-2 bg-black text-white text-sm rounded-lg">
                {getActiveFilterCount()} активных
              </span>
            )}

            {/* Advanced Filters Toggle */}
            {showAdvancedFilters && Object.keys(filterConfig).length > 0 && (
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isAdvancedOpen 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" className="w-4 h-4" />
                <span>Фильтры</span>
              </button>
            )}

            {/* Sort Options */}
            {showSortOptions && Object.keys(sortConfig.options || {}).length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Без сортировки</option>
                  {Object.entries(sortConfig.options || {}).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Сортировка: ${sortDirection === 'asc' ? 'по возрастанию' : 'по убыванию'}`}
                >
                  <Icon 
                    path={sortDirection === 'asc' 
                      ? "M3 4.5h14.25M3 9h9.75M3 13.5h5.25m0 0L12 9m0 4.5L16.5 9M3 18h7.5" 
                      : "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m0 0L12 18m0-4.5l4.5 4.5M3 18h5.25"
                    } 
                    className="w-4 h-4" 
                  />
                </button>
              </div>
            )}

            {/* Clear All */}
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(filterConfig).map(([key, config]) => 
                  renderFilterControl(key, config)
                )}
              </div>

              {/* Saved Filters Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Сохраненные фильтры</h4>
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Сохранить текущий
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {savedFilters.map(filter => (
                    <div
                      key={filter.id}
                      className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2"
                    >
                      <button
                        onClick={() => loadSavedFilter(filter)}
                        className="text-sm text-gray-700 hover:text-black"
                      >
                        {filter.name}
                      </button>
                      <button
                        onClick={() => deleteSavedFilter(filter.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {savedFilters.length === 0 && (
                    <p className="text-sm text-gray-500">Нет сохраненных фильтров</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Filter Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Сохранить фильтр
              </h3>
              
              <input
                type="text"
                placeholder="Название фильтра"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                autoFocus
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFilterName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={saveCurrentFilter}
                  disabled={!filterName.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilterSystem;