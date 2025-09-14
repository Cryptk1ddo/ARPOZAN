import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-lg border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">ARPOZAN</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Натуральные добавки для мужского здоровья и энергии. Качество,
              эффективность и безопасность в каждом продукте.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Продукты</h4>
            <div className="space-y-2">
              <Link
                href="/maca"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Мака перуанская
              </Link>
              <Link
                href="/Yohimbin"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Йохимбин Premium
              </Link>
              <Link
                href="/zinc"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Цинк пиколинат
              </Link>
              <Link
                href="/Long-jack"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Тонгкат Али
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Поддержка</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Доставка и оплата
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Возврат товара
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                FAQ
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Контакты
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail size={16} />
                <span>support@arpozan.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone size={16} />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPin size={16} />
                <span>Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 ARPOZAN. Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Политика конфиденциальности
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
