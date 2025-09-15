import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2025 ARPOZAN Admin Panel. Все права защищены.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Система управления премиальными добавками для мужского здоровья
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <motion.a
              href="/admin/help"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Справка
            </motion.a>
            <motion.a
              href="/admin/support"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Поддержка
            </motion.a>
            <motion.a
              href="/admin/docs"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Документация
            </motion.a>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Система активна</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>Версия панели: 2.1.0 | Последнее обновление: 15 сентября 2025</p>
            <p className="mt-2 md:mt-0">Производительность: ⚡ Отлично | Загрузка: 1.2s</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;