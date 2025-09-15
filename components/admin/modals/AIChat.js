import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Download,
  Copy
} from 'lucide-react';

const Message = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        isUser ? 'bg-blue-500/20' : 'bg-purple-500/20'
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-blue-400" />
        ) : (
          <Bot className="h-4 w-4 text-purple-400" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-lg ${
          isUser 
            ? 'bg-blue-500/20 text-blue-100' 
            : 'bg-white/5 border border-white/10 text-gray-200'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-white/10">
              <button
                onClick={() => copyToClipboard(message.content)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Копировать"
              >
                <Copy className="h-3 w-3" />
              </button>
              {copied && (
                <span className="text-green-400 text-xs">Скопировано!</span>
              )}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </motion.div>
  );
};

const AIChat = ({ isOpen, onClose, isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Здравствуйте! Я ваш AI-помощник для управления магазином ARPOZAN. Чем могу помочь?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput) => {
    const responses = {
      'продажи': "За последний месяц ваши продажи составили 2,450,000 ₽, что на 15% больше по сравнению с предыдущим месяцем. Самый популярный товар - Мака Перуанская.",
      'заказы': "У вас 23 новых заказа, 15 заказов в обработке и 5 заказов готовы к отправке. Рекомендую проверить заказы, ожидающие более 24 часов.",
      'товары': "В каталоге 42 активных товара. 3 товара заканчиваются (менее 10 штук на складе). Рекомендую пополнить запасы Йохимбина и Цинка.",
      'аналитика': "Конверсия сайта составляет 3.2%, средний чек 5,800 ₽. Самый эффективный канал трафика - органический поиск (45% продаж).",
      'клиенты': "У вас 1,247 зарегистрированных клиентов, 156 VIP-клиентов. Средняя частота покупок - 2.3 раза в год.",
      'настройки': "Все системы работают нормально. Последнее обновление было 3 дня назад. Рекомендую проверить настройки уведомлений."
    };

    const input = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (input.includes(key)) {
        return response;
      }
    }

    return "Спасибо за ваш вопрос! Я проанализирую данные и предоставлю детальную информацию. Для более конкретного ответа уточните, что именно вас интересует: продажи, заказы, товары, аналитика, клиенты или настройки?";
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        content: "Чат очищен. Чем могу помочь?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const exportChat = () => {
    const chatHistory = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString('ru-RU')}] ${msg.isUser ? 'Вы' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`glass-card bg-white/10 border border-white/20 rounded-xl w-full transition-all duration-300 ${
          isMinimized ? 'max-w-md h-16' : 'max-w-4xl h-[80vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Помощник</h3>
              {!isMinimized && (
                <p className="text-sm text-gray-400">Умный помощник для управления ARPOZAN</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isMinimized && (
              <>
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Очистить чат"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={exportChat}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Экспорт чата"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onToggleMinimize}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title={isMinimized ? "Развернуть" : "Свернуть"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <Message key={message.id} message={message} isUser={message.isUser} />
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Задайте вопрос о вашем магазине..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="glow-button text-black font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Продажи за месяц', 'Новые заказы', 'Остатки товаров', 'Аналитика'].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInputMessage(action);
                      setTimeout(sendMessage, 100);
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AIChat;