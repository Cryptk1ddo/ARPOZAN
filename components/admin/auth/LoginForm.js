import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../../../lib/supabase';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }
      
      // Check if user has admin privileges
      // This would typically be checked against user metadata or a separate admin table
      if (data.user && (data.user.email.includes('admin') || data.user.email === 'admin@arpozan.com')) {
        onSuccess(data.user);
      } else {
        setError('У вас нет прав доступа к панели администратора');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Login error:', error);
      switch (error.message) {
        case 'Invalid login credentials':
          setError('Неверный email или пароль');
          break;
        case 'Email not confirmed':
          setError('Email не подтвержден');
          break;
        case 'Too many requests':
          setError('Слишком много попыток входа. Попробуйте позже.');
          break;
        default:
          setError('Ошибка входа. Попробуйте снова.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/10 border border-white/20 rounded-xl w-full max-w-md p-8"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center"
          >
            <Lock className="h-8 w-8 text-blue-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">ARPOZAN</h1>
          <p className="text-gray-400">Панель администратора</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                placeholder="admin@arpozan.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                placeholder="Введите пароль"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full glow-button text-black font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Вход...</span>
              </>
            ) : (
              <span>Войти в панель</span>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2">Демо-доступ:</h4>
          <p className="text-blue-200 text-sm">
            Email: admin@arpozan.com<br />
            Пароль: admin123
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 ARPOZAN. Все права защищены.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;