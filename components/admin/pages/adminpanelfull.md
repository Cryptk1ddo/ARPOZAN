<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Панель администратора бренда добавок</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Additional styles for Swiss design principles on mobile */
    @media (max-width: 640px) {
      .metric-card-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .metric-card-grid .metric-card:nth-child(1) {
        grid-column: 1 / -1; /* Full width for the most important metric */
      }
    }
    .skeleton-loader {
      background-color: #e5e7eb; /* gray-200 */
      border-radius: 4px;
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .dark .skeleton-loader {
      background-color: #374151; /* gray-700 */
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
     .ai-glow {
      box-shadow: 0 0 15px rgba(229, 229, 229, 0.1), 0 0 5px rgba(229, 229, 229, 0.2);
      animation: ai-glow-animation 3s ease-in-out infinite;
    }
    @keyframes ai-glow-animation {
      0%, 100% { box-shadow: 0 0 15px rgba(229, 229, 229, 0.1), 0 0 5px rgba(229, 229, 229, 0.1); }
      50% { box-shadow: 0 0 25px rgba(229, 229, 229, 0.2), 0 0 10px rgba(229, 229, 229, 0.25); }
    }
  </style>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            'mono-bg-dark': '#000000',
            'mono-surface-dark': '#111111',
            'mono-border-dark': '#222222',
            'mono-text-light': '#F5F5F5',
            'mono-text-medium': '#A3A3A3',
            'mono-text-dark': '#737373',
            'mono-accent': '#FFFFFF',
            'mono-accent-dark': '#E5E5E5',
            'brand-positive': '#4ade80', // green-400
            'brand-negative': '#f87171', // red-400
          },
        },
      },
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/framer-motion@10.16.4/dist/framer-motion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.js"></script>
  
  <!-- Firebase SDKs -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    window.firebaseApp = initializeApp;
    import { getAuth, onAuthStateChanged, signOut, signInAnonymously, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    window.FirebaseAuth = { getAuth, onAuthStateChanged, signOut, signInAnonymously, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword };
    import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
    window.FirebaseFirestore = { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit };
  </script>

</head>
<body class="bg-gray-50 dark:bg-mono-bg-dark">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, Component, memo, useMemo } = React;
    const { createRoot, createPortal } = ReactDOM;
    const { motion, AnimatePresence } = window.Motion;

    // Firebase Initialization
    const firebaseConfig = typeof __firebase_config !== 'undefined' 
        ? JSON.parse(__firebase_config)
        : {};
    
    let app, auth, db;
    try {
        app = window.firebaseApp(firebaseConfig);
        auth = window.FirebaseAuth.getAuth(app);
        db = window.FirebaseFirestore.getFirestore(app);
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    
    // --- AUTHENTICATION PAGE ---
    const AuthPage = ({ onAuth }) => {
        const [isLogin, setIsLogin] = useState(true);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            try {
                if (isLogin) {
                    await window.FirebaseAuth.signInWithEmailAndPassword(auth, email, password);
                } else {
                    await window.FirebaseAuth.createUserWithEmailAndPassword(auth, email, password);
                }
                onAuth();
            } catch (err) {
                setError(err.message);
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-mono-bg-dark">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-8 bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl w-full max-w-sm"
                >
                    <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-mono-text-light">VITALITY</h1>
                    <p className="text-center text-gray-600 dark:text-mono-text-dark mb-6">{isLogin ? 'Войдите, чтобы продолжить' : 'Создайте аккаунт'}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded border bg-transparent border-gray-300 dark:border-mono-border-dark text-gray-900 dark:text-mono-text-light focus:ring-gray-500 dark:focus:ring-mono-accent-dark focus:border-gray-500 dark:focus:border-mono-accent-dark"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded border bg-transparent border-gray-300 dark:border-mono-border-dark text-gray-900 dark:text-mono-text-light focus:ring-gray-500 dark:focus:ring-mono-accent-dark focus:border-gray-500 dark:focus:border-mono-accent-dark"
                            required
                        />
                        <button type="submit" className="w-full px-4 py-2 text-sm font-medium rounded-md text-mono-bg-dark bg-mono-accent hover:bg-mono-accent-dark transition">
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
                    <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-xs text-center text-gray-500 dark:text-mono-text-dark hover:underline">
                        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                    </button>
                </motion.div>
            </div>
        );
    };


    // --- ENRICHED MOCK DATA ---
    const quotes = [
        { text: "Двигайтесь быстро и исправляйте ошибки: наш подход к быстрой разработке и итерациям позволяет нам внедрять инновации с головокружительной скоростью. Нас не интересует скорость ради скорости — мы здесь, чтобы решать реальные проблемы.", author: "— Философия xAI" },
        { text: "Если вы не двигаетесь быстро, вас обгонит тот, кто движется.", author: "— Илон Маск" },
        { text: "Неудача — это один из вариантов. Если у вас ничего не ломается, значит, вы недостаточно инновационны.", author: "— Илон Маск" }
    ];
    const growthMetricsData = [
        { 
            name: 'Рост выручки', value: '+45%', change: '+15% за мес.', icon: '📈', highlight: true,
            explanation: "Измеряет процентное увеличение общих продаж за период.",
            example: "Кампания 'Купи один, получи второй со скидкой 50%' для нашего популярного протеина привела к 20% всплеску ежедневных продаж, напрямую увеличив рост выручки в этом месяце.",
            logicChain: "Рост выручки (1-й порядок) → Увеличение денежного потока для реинвестирования (2-й порядок) → Позволяет делать более крупные закупки товаров (сокращая дефицит) и проводить более масштабные маркетинговые кампании (ускоряя привлечение клиентов) (3-й порядок)."
        },
        { 
            name: 'Новые клиенты', value: '12.5K', change: '+30%', icon: '👥',
            explanation: "Отслеживает количество покупателей, совершивших первую покупку за период.",
            example: "Благодаря сотрудничеству с фитнес-инфлюенсером для промо-видео мы привлекли 500 новых клиентов за одну неделю, которые использовали его уникальный промокод.",
            logicChain: "Больше новых клиентов (1-й) → Увеличение доли рынка и узнаваемости бренда (2-й) → Создает больше сарафанного радио и большую базу для ретаргетинга, снижая будущие затраты на привлечение (3-й)."
        },
        { 
            name: 'Уровень удержания', value: '78%', change: '+5%', icon: '🔄',
            explanation: "Процент клиентов, совершающих повторные покупки.",
            example: "Мы запустили сервис подписки. 5000 клиентов подписались, гарантируя повторные покупки и увеличив уровень удержания с 70% до 78%.",
            logicChain: "Высокий уровень удержания (1-й) → Создает предсказуемый, стабильный ежемесячный доход (2-й) → Эта стабильность позволяет точнее финансово прогнозировать и делать более смелые долгосрочные инвестиции в разработку новых продуктов (3-й)."
        },
        { 
            name: 'LTV клиента', value: '$450', change: '+12%', icon: '💎',
            explanation: "Прогнозирует общий доход, который один клиент принесет за все время.",
            example: "Внедрив программу лояльности, где клиенты зарабатывают баллы, мы поощряем их делать 4-ю и 5-ю покупки, увеличивая средний LTV с $400 до $450.",
            logicChain: "Высокий LTV (1-й) → Мы можем позволить себе тратить больше на привлечение одного клиента, оставаясь прибыльными (2-й) → Это открывает доступ к более дорогим (но с большим охватом) рекламным каналам, таким как ТВ или крупные подкасты, ускоряя рост (3-й)."
        }
    ];
    const keyMetricsData = [
        { 
            name: 'Средний чек', value: '$85', change: '+8%', icon: '🛒',
            explanation: "Средняя сумма, потраченная за одну транзакцию.",
            example: "Когда клиент добавляет предтренировочный комплекс в корзину, мы показываем всплывающее окно: 'Добавьте креатин всего за $15!' Эта тактика бандлинга увеличивает средний чек.",
            logicChain: "Высокий средний чек (1-й) → Увеличение прибыли с каждой транзакции без увеличения стоимости доставки (2-й) → Эту дополнительную прибыль можно использовать для предложения бесплатной доставки при определенной сумме заказа, что, в свою очередь, еще больше увеличивает средний чек и конверсию (3-й)."
        },
        { 
            name: 'CAC', value: '$25', change: '-10%', icon: '💰',
            explanation: "Стоимость привлечения клиента, затраты на получение нового клиента.",
            example: "Вместо широкой рекламы в соцсетях мы нацеливаемся на пользователей, которые посещали сайты конкурентов. Этот гипертаргетинг более эффективен, снижая CAC с $30 до $25.",
            logicChain: "Низкий CAC (1-й) → Тот же маркетинговый бюджет привлекает больше клиентов (2-й) → Это ускоряет проникновение на рынок и позволяет бизнесу агрессивно масштабироваться, сохраняя прибыльность (3-й)."
        },
        { 
            name: 'Коэффициент конверсии', value: '4.2%', change: '+0.5%', icon: '🎯',
            explanation: "Процент посетителей сайта, совершивших покупку.",
            example: "Оптимизировав страницу продукта с более четкими изображениями и быстрой загрузкой, процент посетителей, совершающих покупку, вырос с 3.7% до 4.2%.",
            logicChain: "Высокая конверсия (1-й) → Больше продаж при том же объеме трафика (2-й) → Это делает наши рекламные расходы более прибыльными и оправдывает увеличение маркетингового бюджета для еще более быстрого роста (3-й)."
        },
        { 
            name: 'Оборачиваемость запасов', value: '6x', change: '+2x', icon: '📦',
            explanation: "Как часто запасы продаются и пополняются за период.",
            example: "Мы выявляем медленно продающуюся добавку и проводим распродажу. Это высвобождает деньги и складское пространство для нового, востребованного продукта, увеличивая общую оборачиваемость.",
            logicChain: "Высокая оборачиваемость (1-й) → Капитал не заморожен в непроданных товарах; он постоянно работает (2-й) → Позволяет быстрее адаптироваться к рыночным тенденциям и снижает риск хранения устаревших запасов, сохраняя гибкость бизнеса (3-й)."
        }
    ];
    const inventoryData = [
        { 
            name: 'Всего SKU', value: '150', change: '+10%', icon: '💊',
            explanation: "Количество уникальных товарных позиций (продуктов/вариантов).",
            example: "Мы запускаем новый вкус нашего протеина, что добавляет один новый SKU в наш ассортимент, расширяя привлекательность продукта.",
            logicChain: "Управляемый рост SKU (1-й) → Удовлетворение более широкого круга предпочтений клиентов, что потенциально увеличивает продажи (2-й) → Однако, слишком много SKU может усложнить логистику и увеличить затраты на хранение, поэтому важен баланс между разнообразием и эффективностью (3-й)."
        },
        { 
            name: 'Оповещения о низком запасе', value: '8', change: '-2%', icon: '⚠️',
            explanation: "Количество товаров с уровнем запасов ниже порогового значения.",
            example: "Наша система автоматически заказывает наш самый продаваемый витамин С, когда запас падает ниже 100 единиц, предотвращая срабатывание оповещения о низком запасе.",
            logicChain: "Меньше оповещений (1-й) → Меньше случаев дефицита товара, что означает более стабильные продажи (2-й) → Это создает доверие клиентов и надежность, поощряя повторные покупки и защищая потоки доходов в периоды высокого спроса (3-й)."
        },
        { 
            name: 'Продления подписок', value: '2.3K', change: '+25%', icon: '🔄',
            explanation: "Количество продлений подписок в этом месяце.",
            example: "Мы отправляем подписчикам напоминание за 3 дня до продления, включая небольшую скидку 'в знак благодарности', что увеличивает коэффициент продления на 10%.",
            logicChain: "Больше продлений (1-й) → Более высокий предсказуемый, регулярный доход (MRR) (2-й) → Эта стабильная финансовая база привлекательна для инвесторов и позволяет уверенно осуществлять долгосрочное стратегическое планирование и наем персонала (3-й)."
        },
        { 
            name: 'Запуски новых продуктов', value: '5', change: '+100%', icon: '🚀',
            explanation: "Количество новых продуктов, выведенных на рынок.",
            example: "В этом квартале мы успешно запустили линейку веганского протеина и новую добавку для гидратации, всего 5 новых продуктов.",
            logicChain: "Успешные запуски (1-й) → Создают ажиотаж на рынке и привлекают новые сегменты клиентов (2-й) → Поддерживают инновационность и актуальность бренда, предотвращая стагнацию и открывая совершенно новые источники дохода для будущего роста (3-й)."
        }
    ];
    
    // --- UTILITY HOOKS & FUNCTIONS ---
    const useIsMobile = (breakpoint = 1024) => { 
        const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [breakpoint]);
        return isMobile;
    };

    const simulateDataUpdate = (data) => data.map(item => {
        let newValue;
        const originalValue = item.value.toString();
        if (originalValue.includes('%')) newValue = `${(parseFloat(originalValue) + (Math.random() * 2 - 1)).toFixed(1)}%`;
        else if (originalValue.includes('$')) newValue = `$${(parseFloat(originalValue.replace('$', '')) + (Math.random() * 10 - 5)).toFixed(2)}`;
        else if (originalValue.includes('K')) newValue = `${(parseFloat(originalValue.replace('K', '')) + (Math.random() * 0.5 - 0.25)).toFixed(1)}K`;
        else if (originalValue.includes('x')) newValue = `${(parseFloat(originalValue.replace('x', '')) + (Math.random() * 0.2 - 0.1)).toFixed(1)}x`;
        else newValue = `${(parseInt(originalValue) + Math.round(Math.random() * 4 - 2))}`;
        return { ...item, value: newValue };
    });

    const generateContent = async (prompt) => {
        const apiKey = ""; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorBody = await response.json(); console.error("API Error Response:", errorBody); throw new Error(`API request failed with status ${response.status}`); }
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } catch (error) {
            console.error("Failed to generate content:", error);
            return "Ошибка: Не удалось сгенерировать контент.";
        }
    };

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                headers.map(fieldName => 
                    JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
                ).join(',')
            )
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // --- GENERIC & UI COMPONENTS ---
    const Icon = ({ path, className = "w-6 h-6" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} /></svg>);
    
    const LoadingSpinner = memo(({fullscreen = false}) => (
      <div className={`flex justify-center items-center h-full w-full ${fullscreen ? 'fixed inset-0 bg-white dark:bg-mono-bg-dark z-50' : ''}`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-4 border-mono-border-dark border-t-transparent rounded-full" role="status" aria-label="Загрузка"/>
      </div>
    ));

    const TableSkeleton = () => (
        <div className="overflow-x-auto bg-white dark:bg-mono-surface-dark rounded-lg shadow-md p-4">
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <div className="w-10 h-10 skeleton-loader rounded-full"></div>
                        <div className="flex-1 space-y-2"><div className="h-4 skeleton-loader w-3/4"></div><div className="h-3 skeleton-loader w-1/2"></div></div>
                        <div className="h-6 w-20 skeleton-loader"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    class ErrorBoundary extends Component {
        state = { hasError: false };
        static getDerivedStateFromError(error) { return { hasError: true }; }
        componentDidCatch(error, errorInfo) { console.error("ErrorBoundary caught an error", error, errorInfo); }
        render() {
            if (this.state.hasError) {
                return <div className="p-4 bg-red-500/10 text-red-400 rounded-lg max-w-6xl mx-auto mt-20 text-center"><h2 className="text-lg font-medium">Что-то пошло не так.</h2><p>Пожалуйста, обновите страницу, чтобы попробовать снова.</p></div>;
            }
            return this.props.children;
        }
    }
    
    const PageWrapper = ({ children, title }) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-mono-text-light mb-4 sm:mb-6">{title}</h1>
            {children}
        </motion.div>
    );

    const EmptyState = ({ icon, title, message }) => (
        <div className="text-center py-10 px-4 rounded-lg bg-white dark:bg-mono-surface-dark/50">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-mono-border-dark">
                <Icon path={icon} className="h-6 w-6 text-gray-500 dark:text-mono-text-dark" />
            </div>
            <h3 className="mt-5 text-sm font-medium text-gray-900 dark:text-mono-text-light">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-mono-text-dark">{message}</p>
        </div>
    );
    
    const Toast = ({ message, type, onDismiss }) => {
        const icons = { success: "M5 13l4 4L19 7", error: "M6 18L18 6M6 6l12 12" };
        const colors = { success: "bg-brand-positive text-black", error: "bg-brand-negative text-white" };
        useEffect(() => { const timer = setTimeout(onDismiss, 3000); return () => clearTimeout(timer); }, [onDismiss]);
        return (
            <motion.div layout initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.5 }} className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg z-50 ${colors[type]}`}>
                <div className="mr-3"><Icon path={icons[type]} className="w-5 h-5" /></div><div>{message}</div>
            </motion.div>
        );
    };

    const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl w-full max-w-sm">
                <div className="p-6"><h3 className="text-lg font-bold text-gray-900 dark:text-mono-text-light">{title}</h3><p className="mt-2 text-sm text-gray-600 dark:text-mono-text-dark">{message}</p></div>
                <div className="bg-gray-50 dark:bg-mono-bg-dark px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-mono-border-dark hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-mono-text-light transition">Отмена</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-mono-negative hover:bg-gray-600 transition">Удалить</button>
                </div>
            </motion.div>
        </motion.div>
    );

    const ProductModal = ({ product, onSave, onCancel }) => {
        const [formData, setFormData] = useState(product || { name: '', category: '', stock: 0, price: 0, imageUrl: '', description: '' });
        const [isGenerating, setIsGenerating] = useState(false);
        const isNew = !product?.id;

        const handleChange = (e) => { const { name, value, type } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value })); };
        
        const handleGenerateDescription = async () => {
            if (!formData.name || !formData.category) { alert("Пожалуйста, сначала введите название и категорию продукта."); return; }
            setIsGenerating(true);
            const prompt = `Напиши короткое, броское и убедительное описание для продукта-добавки под названием "${formData.name}" в категории "${formData.category}". Сосредоточься на преимуществах для быстрого роста и спортивных результатов. Длина до 500 символов.`;
            const generatedDesc = await generateContent(prompt);
            setFormData(prev => ({ ...prev, description: generatedDesc }));
            setIsGenerating(false);
        };

        const handleSubmit = (e) => { e.preventDefault(); const finalData = { ...formData, imageUrl: formData.imageUrl || `https://placehold.co/400x400/111111/F5F5F5?text=${formData.name.charAt(0)}` }; onSave(finalData); };
        
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6"><h2 className="text-xl font-bold text-gray-900 dark:text-mono-text-light mb-4">{isNew ? "Добавить продукт" : "Редактировать продукт"}</h2>
                            <div className="space-y-4 text-gray-600 dark:text-mono-text-medium">
                                <div><label className="block text-sm font-medium">Название продукта</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border border-gray-300 dark:border-mono-border-dark rounded-md" required /></div>
                                <div><label className="block text-sm font-medium">URL изображения (необязательно)</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border-mono-border-dark rounded-md" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div><label className="block text-sm font-medium">Категория</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border-mono-border-dark rounded-md" required /></div>
                                  <div><label className="block text-sm font-medium">Запас</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border-mono-border-dark rounded-md" required /></div>
                                </div>
                                <div><label className="block text-sm font-medium">Цена</label><input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border-mono-border-dark rounded-md" required /></div>
                                <div>
                                    <div className="flex justify-between items-center"><label className="block text-sm font-medium">Описание</label><button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-xs flex items-center gap-1 text-gray-500 dark:text-mono-text-medium disabled:opacity-50">✨ {isGenerating ? 'Генерация...' : 'Сгенерировать с AI'}</button></div>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 bg-gray-50 dark:bg-mono-bg-dark border-mono-border-dark rounded-md" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-mono-bg-dark px-6 py-3 flex justify-end space-x-3 rounded-b-lg border-t dark:border-mono-border-dark">
                            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-mono-border-dark hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-mono-text-light transition">Отмена</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-black bg-mono-accent hover:bg-mono-accent-dark transition">Сохранить продукт</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        );
    };
    
    const OrderDetailsModal = ({ order, onCancel }) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-mono-border-dark"><h2 className="text-xl font-bold text-gray-900 dark:text-mono-text-light">Детали заказа</h2><p className="text-sm text-gray-500 dark:text-mono-text-dark">Заказ #{order.id.slice(0, 7)}</p></div>
                <div className="p-6 space-y-4 text-gray-600 dark:text-mono-text-medium">
                    <div><h3 className="font-semibold text-gray-900 dark:text-mono-text-light">Клиент</h3><p>{order.customer.name}</p><p className="text-sm text-gray-500 dark:text-mono-text-dark">{order.customer.email}</p></div>
                    <div><h3 className="font-semibold text-gray-900 dark:text-mono-text-light">Продукт</h3><p>{order.product.name} (x{order.product.quantity})</p></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><h3 className="font-semibold text-gray-900 dark:text-mono-text-light">Сумма</h3><p>${order.amount.toFixed(2)}</p></div>
                        <div><h3 className="font-semibold text-gray-900 dark:text-mono-text-light">Статус</h3><p>{order.status}</p></div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-mono-bg-dark px-6 py-3 flex justify-end rounded-b-lg"><button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-800 text-white hover:bg-gray-700 dark:bg-mono-accent dark:text-black dark:hover:bg-mono-accent-dark transition">Закрыть</button></div>
            </motion.div>
        </motion.div>
    );

    const ExplanationModal = ({ metric, onClose }) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-mono-text-light mb-1">{metric.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-mono-text-dark mb-4">{metric.explanation}</p>
                    <div className="space-y-4">
                        <div><h4 className="text-xs font-bold text-gray-500 dark:text-mono-text-dark uppercase tracking-wider mb-1">Реальный пример</h4><p className="text-sm text-gray-700 dark:text-mono-text-medium bg-gray-100 dark:bg-mono-bg-dark p-3 rounded-md">{metric.example}</p></div>
                        <div><h4 className="text-xs font-bold text-brand-positive uppercase tracking-wider mb-1">Стратегическое влияние (2-го и 3-го порядка)</h4><p className="text-sm text-gray-700 dark:text-mono-text-medium bg-gray-100 dark:bg-mono-bg-dark p-3 rounded-md">{metric.logicChain}</p></div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-mono-bg-dark px-6 py-3 flex justify-end rounded-b-lg border-t dark:border-mono-border-dark"><button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-800 text-white dark:bg-mono-accent dark:text-black hover:bg-gray-700 dark:hover:bg-mono-accent-dark transition">Понятно</button></div>
            </motion.div>
        </motion.div>
    );


    // --- LAYOUT COMPONENTS ---
    const Notifications = memo(({ user }) => {
        const [notifications, setNotifications] = useState([]);
        const [isOpen, setIsOpen] = useState(false);
        const { query, collection, onSnapshot, orderBy, limit } = window.FirebaseFirestore;
        useEffect(() => {
            if (!db || !user) return;
            const userId = user.uid;
            const userNotificationsPath = `artifacts/${appId}/users/${userId}/notifications`;
            const q = query(collection(db, userNotificationsPath), orderBy("timestamp", "desc"), limit(10));
            const unsubscribe = onSnapshot(q, (snapshot) => setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))), console.error);
            return () => unsubscribe();
        }, [user]);
        const unreadCount = notifications.filter(n => !n.read).length;
        return (
            <div className="relative">
                <button onClick={() => setIsOpen(p => !p)} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    {unreadCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />}
                </button>
                <AnimatePresence>
                    {isOpen && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute right-0 mt-2 w-80 bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl z-20">
                        <div className="p-3 font-semibold border-b border-gray-200 dark:border-mono-border-dark text-gray-900 dark:text-mono-text-light">Уведомления</div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? <div className="p-4"><EmptyState icon="M15 17h5l-1.4-1.4a2 2 0 01-3.2 0L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" title="Все в порядке" message="У вас нет новых уведомлений." /></div> :
                            notifications.map(n => <div key={n.id} className="p-3 border-b border-gray-200 dark:border-mono-border-dark/50 text-sm hover:bg-gray-50 dark:hover:bg-mono-border-dark/30"><p className="text-gray-700 dark:text-mono-text-medium">{n.text}</p><p className="text-xs text-gray-500 dark:text-mono-text-dark mt-1">{new Date(n.timestamp?.toDate()).toLocaleString()}</p></div>)}
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </div>
        );
    });

    const Header = memo(({ theme, toggleTheme, toggleSidebar, user, onLogout, onChatOpen }) => {
      const isMobile = useIsMobile();
      const [menuOpen, setMenuOpen] = useState(false);
      return (
          <motion.header initial={{ y: -64 }} animate={{ y: 0 }} className="bg-white/80 dark:bg-black/50 backdrop-blur-sm text-gray-800 dark:text-white py-3 px-4 sm:px-6 shadow-md fixed top-0 w-full z-30">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {!isMobile && (
                    <button onClick={toggleSidebar} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"><Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5"/></button>
                )}
                <h1 className="text-lg font-bold tracking-wider flex items-center gap-2"><Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-5 h-5 text-gray-800 dark:text-mono-positive"/>VITALITY</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={onChatOpen} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"><Icon path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></button>
                <Notifications user={user} />
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">{theme === 'dark' ? '☀️' : '🌙'}</button>
                 <div className="relative">
                    <button onClick={() => setMenuOpen(p => !p)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                        <Icon path="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </button>
                     <AnimatePresence>
                    {menuOpen && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute right-0 mt-2 w-48 bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl z-20 overflow-hidden">
                        <div className="p-3 border-b border-gray-200 dark:border-mono-border-dark">
                            <p className="text-sm font-semibold text-gray-900 dark:text-mono-text-light">Профиль</p>
                            <p className="text-xs text-gray-500 dark:text-mono-text-dark truncate">{user.email}</p>
                        </div>
                        <button onClick={onLogout} className="w-full text-left p-3 text-sm text-gray-700 dark:text-mono-text-medium hover:bg-gray-100 dark:hover:bg-mono-border-dark">Выйти</button>
                    </motion.div>}
                </AnimatePresence>
                 </div>
              </div>
            </div>
          </motion.header>
      );
    });

    const Sidebar = memo(({ currentView, setCurrentView, isCollapsed, setIsCollapsed }) => {
        const navItems = [
            { name: 'Панель управления', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { name: 'Продукты', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
            { name: 'Отчеты', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z' },
            { name: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        ];
        return (
            <motion.aside 
                animate={{ width: isCollapsed ? '5rem' : '16rem' }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-full bg-gray-50 dark:bg-mono-surface-dark border-r border-gray-200 dark:border-mono-border-dark text-gray-800 dark:text-white p-4 z-20 pt-20 hidden lg:flex flex-col justify-between"
            >
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <button 
                            key={item.name} 
                            onClick={() => setCurrentView(item.name)} 
                            className={`w-full flex items-center gap-3 p-3 rounded text-sm font-medium transition-colors ${currentView === item.name ? 'bg-gray-200 text-gray-900 dark:bg-mono-accent dark:text-black' : 'hover:bg-gray-200/50 text-gray-600 dark:hover:bg-white/10 dark:text-mono-text-medium'}`}
                        >
                            <Icon path={item.icon} className="w-5 h-5 flex-shrink-0"/>
                            <AnimatePresence>
                                {!isCollapsed && <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="whitespace-nowrap">{item.name}</motion.span>}
                            </AnimatePresence>
                        </button>
                    ))}
                </nav>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="w-full flex items-center gap-3 p-3 rounded text-sm font-medium hover:bg-gray-200/50 text-gray-600 dark:hover:bg-white/10 dark:text-mono-text-medium"
                >
                    <Icon path={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                        {!isCollapsed && <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="whitespace-nowrap">Свернуть</motion.span>}
                    </AnimatePresence>
                </button>
            </motion.aside>
        );
    });

    const BottomNavBar = ({ currentView, setCurrentView }) => {
        const navItems = [
            { name: 'Панель управления', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { name: 'Продукты', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
            { name: 'Отчеты', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z' },
            { name: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        ];
        return (
            <motion.nav initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-mono-surface-dark border-t border-gray-200 dark:border-mono-border-dark flex justify-around items-center z-30 lg:hidden">
                {navItems.map(item => (
                    <motion.button whileTap={{ scale: 0.9 }} key={item.name} onClick={() => setCurrentView(item.name)} className={`flex flex-col items-center justify-center text-xs gap-1 transition-colors ${currentView === item.name ? 'text-gray-900 dark:text-mono-accent-dark' : 'text-gray-500 dark:text-mono-text-dark hover:text-gray-800 dark:hover:text-mono-text-medium'}`}>
                        <Icon path={item.icon} className="w-5 h-5" />
                        {item.name}
                    </motion.button>
                ))}
            </motion.nav>
        );
    }
    
    const Footer = memo(() => <footer className="text-center p-4 text-xs text-gray-500 dark:text-mono-text-dark border-t border-gray-200 dark:border-mono-border-dark mt-auto">&copy; {new Date().getFullYear()} Vitality Supplements Inc. Все права защищены.</footer>);
    
    // --- DASHBOARD-SPECIFIC COMPONENTS ---
    const Motto = memo(({ currentQuoteIndex, setCurrentQuoteIndex }) => {
        useEffect(() => { const i = setInterval(() => setCurrentQuoteIndex(p => (p + 1) % quotes.length), 10000); return () => clearInterval(i); }, [setCurrentQuoteIndex]);
        return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-100 dark:bg-mono-surface-dark/50 text-center py-6 px-4 mb-6 rounded-lg">
            <div className="max-w-4xl mx-auto"><AnimatePresence mode="wait"><motion.div key={currentQuoteIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><p className="text-sm italic text-gray-700 dark:text-mono-text-medium">"{quotes[currentQuoteIndex].text}"</p><p className="text-xs text-gray-500 dark:text-mono-text-dark mt-2">{quotes[currentQuoteIndex].author}</p></motion.div></AnimatePresence></div>
        </motion.div>);
    });

    const MetricCard = memo(({ metric, onInfoClick }) => {
        const isMobile = useIsMobile();
        const [showExplanation, setShowExplanation] = useState(false);
        const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
        const timeoutRef = useRef(null);

        const handleMouseEnter = (e) => { setTooltipPosition({ x: e.clientX, y: e.clientY }); timeoutRef.current = setTimeout(() => setShowExplanation(true), 1500); };
        const handleMouseMove = (e) => setTooltipPosition({ x: e.clientX, y: e.clientY });
        const handleMouseLeave = () => { clearTimeout(timeoutRef.current); setShowExplanation(false); };
        const handleInfoButtonClick = (e) => { e.stopPropagation(); onInfoClick(metric); };

        return (
          <motion.div onMouseEnter={!isMobile ? handleMouseEnter : undefined} onMouseMove={!isMobile ? handleMouseMove : undefined} onMouseLeave={!isMobile ? handleMouseLeave : undefined} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} className={`metric-card p-4 bg-white dark:bg-mono-surface-dark rounded-lg relative ${metric.highlight ? 'ring-2 ring-gray-400 dark:ring-mono-accent-dark' : 'ring-1 ring-gray-900/5 dark:ring-white/10'}`}>
            <AnimatePresence>
                {!isMobile && showExplanation && createPortal(<motion.div initial={{ opacity: 0, y: 0, scale: 0.95 }} animate={{ opacity: 1, y: -10, scale: 1 }} exit={{ opacity: 0, y: 0, scale: 0.95 }} className="fixed p-3 bg-black text-white text-xs rounded-lg shadow-lg z-50 w-64 pointer-events-none" style={{ top: tooltipPosition.y, left: tooltipPosition.x, transform: 'translate(-50%, -110%)' }}>
                    <p className="font-bold mb-1">{metric.name}</p><p className="mb-2 opacity-80">{metric.explanation}</p>
                </motion.div>, document.body)}
            </AnimatePresence>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-gray-600 dark:text-mono-text-dark">{metric.name}</p>
                        {isMobile && (<button onClick={handleInfoButtonClick} className="text-gray-400 dark:text-mono-text-dark"><Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" /></button>)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-mono-text-light mt-1">{metric.value}</p>
                    <p className={`text-xs ${metric.change.startsWith('+') ? 'text-brand-positive' : 'text-brand-negative'}`}>{metric.change}</p>
                </div>
                <span className="text-3xl opacity-10 dark:opacity-20">{metric.icon}</span>
            </div>
          </motion.div>
        );
    });

    const ChartComponent = memo(({ type, data, title, theme }) => {
        const chartRef = useRef(null);
        useEffect(() => {
            if (!chartRef.current || !window.Chart) return;
            const textColor = theme === 'dark' ? '#A3A3A3' : '#6B7280';
            const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const pieColors = theme === 'dark' ? ['#E5E5E5', '#A3A3A3', '#737373', '#404040'] : ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'];
            const barColor = theme === 'dark' ? 'rgba(229, 229, 229, 0.5)' : 'rgba(55, 65, 81, 0.5)';
            const borderColor = theme === 'dark' ? '#111111' : '#FFFFFF';
            
            const chartConfigData = Array.isArray(data) ? { labels: data.map(item => item.month || item.label), datasets: [{ data: data.map(item => item.value), backgroundColor: type === 'pie' ? data.map((_, i) => pieColors[i % pieColors.length]) : barColor, borderColor: borderColor, borderWidth: 1, tension: 0.4 }] } : data;
            
            const chart = new Chart(chartRef.current.getContext('2d'), { type, data: chartConfigData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: type === 'pie', position: 'bottom', labels: { color: textColor } }, title: { display: true, text: title, color: textColor, font: { size: 16 } } }, scales: type !== 'pie' && type !== 'radar' ? { y: { ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { color: gridColor } } } : (type === 'radar' ? { r: { angleLines: { color: gridColor }, grid: { color: gridColor }, pointLabels: { color: textColor, font: {size: 12} } } } : {}) } });
            return () => chart.destroy();
        }, [data, type, title, theme]);
        return (<motion.div className="bg-white dark:bg-mono-surface-dark rounded-lg p-4 h-80 ring-1 ring-black/5 dark:ring-white/10"><canvas ref={chartRef} /></motion.div>);
    });

    const LatestOrders = ({ orders }) => (
        <div className="bg-white dark:bg-mono-surface-dark rounded-lg p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-mono-text-light">Последние заказы</h3>
            <div className="space-y-3">
                {orders.length === 0 ? <p className="text-sm text-gray-500 dark:text-mono-text-dark">Нет недавних заказов.</p> :
                    orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex justify-between items-center text-sm">
                            <div><p className="font-medium text-gray-800 dark:text-mono-text-medium">{order.customer.name}</p><p className="text-xs text-gray-500 dark:text-mono-text-dark">{order.product.name}</p></div>
                            <p className="font-semibold text-gray-900 dark:text-mono-text-light">${order.amount.toFixed(2)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );

    const AIInsightCard = ({ insight, isLoading, onRefresh }) => (
        <div className="bg-white dark:bg-mono-surface-dark rounded-lg p-4 ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-mono-text-light flex items-center gap-2">
                    <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 text-gray-500 dark:text-mono-accent-dark" />
                    AI-аналитик
                </h3>
                <button onClick={onRefresh} disabled={isLoading} className="text-xs text-gray-500 dark:text-mono-accent-dark disabled:opacity-50">Обновить</button>
            </div>
            {isLoading ? (
                <div className="space-y-2 mt-3">
                    <div className="h-3.5 skeleton-loader w-full"></div><div className="h-3.5 skeleton-loader w-5/6"></div><div className="h-3.5 skeleton-loader w-3/4"></div>
                </div>
            ) : <p className="text-sm text-gray-600 dark:text-mono-text-medium whitespace-pre-wrap">{insight}</p>
            }
        </div>
    );

    // --- PAGE COMPONENTS ---
    const DashboardPage = ({ metrics, setMetrics, currentQuoteIndex, setCurrentQuoteIndex, orders, onMetricInfoClick, aiInsight, isInsightLoading, onRefreshInsight }) => (
      <PageWrapper title="Панель управления">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Motto currentQuoteIndex={currentQuoteIndex} setCurrentQuoteIndex={setCurrentQuoteIndex} />
                <section>
                    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-gray-900 dark:text-mono-text-light">Метрики быстрого роста</h2><button onClick={() => setMetrics(p => ({ ...p, isPaused: !p.isPaused }))} className="text-xs text-gray-500 dark:text-mono-accent-dark hover:underline">{metrics.isPaused ? 'Возобновить' : 'Приостановить'}</button></div>
                    <div className="metric-card-grid">{metrics.growth.map((m, i) => <MetricCard key={i} metric={m} onInfoClick={onMetricInfoClick} />)}</div>
                </section>
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-mono-text-light mb-4">Ключевые показатели</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{metrics.key.map((m, i) => <MetricCard key={i} metric={m} onInfoClick={onMetricInfoClick} />)}</div>
                </section>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <AIInsightCard insight={aiInsight} isLoading={isInsightLoading} onRefresh={onRefreshInsight} />
                <LatestOrders orders={orders} />
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-mono-text-light mb-4">Запасы и операции</h2>
                    <div className="space-y-4">{inventoryData.map((item, index) => <MetricCard key={index} metric={item} onInfoClick={onMetricInfoClick} />)}</div>
                </section>
              </div>
          </div>
      </PageWrapper>
    );

    const ProductsPage = ({ products, onSaveProduct, onRequestDelete, loading }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [modalProduct, setModalProduct] = useState(null);
        const [filter, setFilter] = useState('Все');
        const handleSave = (productData) => { onSaveProduct(productData); setModalProduct(null); };
        const getStatusPill = (status) => { const colors = { 'В наличии': 'bg-green-500/10 text-green-400', 'Мало на складе': 'bg-yellow-500/10 text-yellow-400', 'Нет в наличии': 'bg-red-500/10 text-red-400' }; return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || ''}`}>{status}</span>; };
        
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && (filter === 'Все' || p.status === filter));
        
        return (
            <PageWrapper title="Продукты">
                <AnimatePresence>{modalProduct && <ProductModal product={modalProduct === 'new' ? null : modalProduct} onSave={handleSave} onCancel={() => setModalProduct(null)} />}</AnimatePresence>
                <div className="bg-white dark:bg-mono-surface-dark rounded-lg p-4 mb-6 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4"><input type="text" placeholder="Поиск продуктов..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-auto sm:max-w-xs p-2 rounded border bg-transparent border-gray-300 dark:border-mono-border-dark text-gray-900 dark:text-mono-text-light focus:ring-gray-500 dark:focus:ring-mono-accent-dark focus:border-gray-500 dark:focus:border-mono-accent-dark"/><button onClick={() => setModalProduct('new')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-mono-bg-dark bg-mono-accent hover:bg-mono-accent-dark"><Icon path="M12 4v16m8-8H4" className="w-5 h-5"/> Добавить продукт</button></div>
                    <div className="flex space-x-2 border-b border-gray-200 dark:border-mono-border-dark overflow-x-auto">
                        {['Все', 'В наличии', 'Мало на складе', 'Нет в наличии'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition ${filter === f ? 'border-b-2 border-gray-800 dark:border-mono-accent-dark text-gray-800 dark:text-mono-accent-dark' : 'text-gray-500 dark:text-mono-text-dark hover:text-gray-800 dark:hover:text-mono-text-medium'}`}>{f}</button>))}
                    </div>
                </div>
                {loading ? <TableSkeleton /> : (
                    <div className="overflow-x-auto bg-white dark:bg-mono-surface-dark rounded-lg ring-1 ring-black/5 dark:ring-white/10">
                        {filteredProducts.length === 0 ? <div className="p-6"><EmptyState icon="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" title="Продукты не найдены" message="Попробуйте изменить поиск или фильтр." /></div> :
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-mono-border-dark">
                            <thead className="bg-gray-50 dark:bg-mono-surface-dark/50"><tr>{['Продукт', 'Категория', 'Запас', 'Цена', 'Статус', 'Действия'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-mono-text-dark">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-mono-border-dark">
                                <AnimatePresence>
                                {filteredProducts.map(p => (<motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 dark:hover:bg-mono-border-dark/20">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full object-cover" src={p.imageUrl} alt={p.name} /></div><div className="ml-4 text-sm font-medium text-gray-900 dark:text-mono-text-light">{p.name}</div></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-mono-text-dark">{p.category}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-mono-text-medium">{p.stock}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-mono-text-medium">${p.price.toFixed(2)}</td><td className="px-6 py-4 text-sm">{getStatusPill(p.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4"><button onClick={() => setModalProduct(p)} className="text-gray-600 dark:text-mono-accent-dark hover:underline">Редакт.</button><button onClick={() => onRequestDelete(p.id)} className="text-brand-negative hover:underline">Удалить</button></td>
                                </motion.tr>))}
                                </AnimatePresence>
                            </tbody>
                        </table>}
                    </div>
                )}
            </PageWrapper>
        );
    };
    
    const OrdersPage = ({ orders, loading }) => {
        const [filter, setFilter] = useState('Все');
        const [selectedOrder, setSelectedOrder] = useState(null);
        const getStatusPill = (status) => { const colors = { 'Завершено': 'bg-green-500/10 text-green-400', 'Отправлено': 'bg-blue-500/10 text-blue-400', 'В ожидании': 'bg-yellow-500/10 text-yellow-400' }; return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>{status}</span>; };
        
        const filteredOrders = orders.filter(order => filter === 'Все' || order.status === filter);

        return (
            <PageWrapper title="Заказы">
                <AnimatePresence>{selectedOrder && <OrderDetailsModal order={selectedOrder} onCancel={() => setSelectedOrder(null)} />}</AnimatePresence>
                <div className="mb-4"><div className="flex space-x-2 border-b border-gray-200 dark:border-mono-border-dark">{['Все', 'В ожидании', 'Отправлено', 'Завершено'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium transition ${filter === f ? 'border-b-2 border-gray-800 dark:border-mono-accent-dark text-gray-800 dark:text-mono-accent-dark' : 'text-gray-500 dark:text-mono-text-dark hover:text-gray-800 dark:hover:text-mono-text-medium'}`}>{f}</button>))}</div></div>
                {loading ? <TableSkeleton /> :
                <div className="overflow-x-auto bg-white dark:bg-mono-surface-dark rounded-lg ring-1 ring-black/5 dark:ring-white/10">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-mono-border-dark">
                        <thead className="bg-gray-50 dark:bg-mono-surface-dark/50"><tr>{['ID', 'Дата', 'Клиент', 'Продукт', 'Сумма', 'Статус'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-mono-text-dark">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-mono-border-dark">
                            <AnimatePresence>
                            {filteredOrders.map(order => (<motion.tr key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 dark:hover:bg-mono-border-dark/20 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-mono-text-light">#{order.id.slice(0, 7)}...</td><td className="px-6 py-4 text-sm text-gray-500 dark:text-mono-text-dark">{new Date(order.date.toDate()).toLocaleDateString()}</td><td className="px-6 py-4 text-sm text-gray-700 dark:text-mono-text-medium">{order.customer.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-mono-text-medium">{order.product.name}</td><td className="px-6 py-4 text-sm text-gray-700 dark:text-mono-text-medium">${order.amount.toFixed(2)}</td><td className="px-6 py-4 text-sm">{getStatusPill(order.status)}</td>
                            </motion.tr>))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>}
            </PageWrapper>
        );
    };

    const ReportsPage = ({ orders, products, loading, theme }) => {
        const [dateRange, setDateRange] = useState({ start: null, end: null });

        const filteredOrders = useMemo(() => {
            if (!dateRange.start || !dateRange.end) return orders;
            return orders.filter(order => {
                const orderDate = order.date.toDate();
                return orderDate >= dateRange.start && orderDate <= dateRange.end;
            });
        }, [orders, dateRange]);

        const reportData = useMemo(() => {
            if (filteredOrders.length === 0) {
                 return { totalRevenue: 0, totalOrders: 0, newCustomers: 0, salesByCategory: [], revenueTrend: [] };
            }
            
            const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
            const totalOrders = filteredOrders.length;
            const newCustomers = new Set(filteredOrders.map(o => o.customer.email)).size;

            const salesByCategory = filteredOrders.reduce((acc, order) => {
                const category = products.find(p => p.name === order.product.name)?.category || 'Другое';
                acc[category] = (acc[category] || 0) + order.amount;
                return acc;
            }, {});

            const revenueTrend = filteredOrders.reduce((acc, order) => {
                const date = order.date.toDate().toISOString().split('T')[0];
                acc[date] = (acc[date] || 0) + order.amount;
                return acc;
            }, {});
            
            const pieColors = ['#E5E5E5', '#A3A3A3', '#737373', '#404040'];

            return {
                totalRevenue,
                totalOrders,
                newCustomers,
                salesByCategory: Object.entries(salesByCategory).map(([label, value], i) => ({ label, value, color: pieColors[i % pieColors.length] })),
                revenueTrend: Object.entries(revenueTrend).sort((a,b) => new Date(a[0]) - new Date(b[0])).map(([date, value]) => ({ month: date, value }))
            };
        }, [filteredOrders, products]);


        const setPresetDateRange = (days) => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - days);
            setDateRange({ start, end });
        };

        return (
          <PageWrapper title="Отчеты">
              <div className="mb-6 bg-white dark:bg-mono-surface-dark p-4 rounded-lg ring-1 ring-black/5 dark:ring-white/10 flex flex-wrap gap-2 justify-between items-center text-gray-800 dark:text-mono-text-light">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setPresetDateRange(7)} className="px-3 py-1 text-sm bg-gray-200 dark:bg-mono-border-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600">За 7 дней</button>
                    <button onClick={() => setPresetDateRange(30)} className="px-3 py-1 text-sm bg-gray-200 dark:bg-mono-border-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600">За 30 дней</button>
                    <button onClick={() => setDateRange({start: null, end: null})} className="px-3 py-1 text-sm bg-gray-200 dark:bg-mono-border-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600">За все время</button>
                  </div>
                   <div className="flex gap-2 items-center text-sm">
                      <input type="date" onChange={e => setDateRange(prev => ({...prev, start: new Date(e.target.value)}))} className="bg-gray-100 dark:bg-mono-bg-dark p-1 rounded border border-gray-300 dark:border-mono-border-dark"/>
                      <span>до</span>
                      <input type="date" onChange={e => setDateRange(prev => ({...prev, end: new Date(e.target.value)}))} className="bg-gray-100 dark:bg-mono-bg-dark p-1 rounded border border-mono-border-dark"/>
                   </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <MetricCard metric={{ name: 'Общая выручка', value: `$${reportData.totalRevenue.toFixed(2)}`, change: '', icon: '💰' }} onInfoClick={() => {}}/>
                  <MetricCard metric={{ name: 'Всего заказов', value: reportData.totalOrders, change: '', icon: '🛒' }} onInfoClick={() => {}}/>
                  <MetricCard metric={{ name: 'Новые клиенты', value: reportData.newCustomers, change: '', icon: '👥' }} onInfoClick={() => {}}/>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartComponent type="bar" data={reportData.revenueTrend} title="Тренд выручки" theme={theme} />
                  <ChartComponent type="pie" data={reportData.salesByCategory} title="Продажи по категориям" theme={theme} />
              </div>
          </PageWrapper>
        );
    };

    const AIChat = ({ open, setOpen, products, orders }) => {
        const [messages, setMessages] = useState([{ role: 'ai', text: 'Здравствуйте! Я ваш бизнес-ассистент. Спрашивайте что угодно о ваших продуктах или заказах.' }]);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const messagesEndRef = useRef(null);

        const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        useEffect(scrollToBottom, [messages]);

        const handleSend = async () => {
            if (!input.trim() || isLoading) return;
            const newMessages = [...messages, { role: 'user', text: input }];
            setMessages(newMessages);
            setInput('');
            setIsLoading(true);

            const prompt = `You are an expert business analyst for a supplement company. Analyze the provided data to answer the user's question. Be concise and clear.
            
            AVAILABLE DATA:
            - Products: ${JSON.stringify(products.slice(0, 20).map(({name, category, price, stock, status}) => ({name, category, price, stock, status})))}
            - Orders: ${JSON.stringify(orders.slice(0, 20).map(({customer, product, amount, status}) => ({customer: customer.name, product: product.name, amount, status})))}

            USER QUESTION:
            "${input}"`;

            const aiResponse = await generateContent(prompt);
            setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
            setIsLoading(false);
        };

        if (!open) return null;

        return createPortal(
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 flex items-end justify-end p-4">
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="w-full max-w-lg h-[70vh] bg-white dark:bg-mono-surface-dark rounded-lg shadow-xl flex flex-col">
                    <header className="p-4 border-b dark:border-mono-border-dark flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-mono-text-light">AI Бизнес-ассистент</h3>
                        <button onClick={() => setOpen(false)} className="text-gray-500 dark:text-mono-text-dark hover:text-gray-800 dark:hover:text-mono-text-light"><Icon path="M6 18L18 6M6 6l12 12" /></button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-800 text-white dark:bg-mono-accent dark:text-black' : 'bg-gray-200 dark:bg-mono-bg-dark text-gray-800 dark:text-mono-text-medium'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-200 dark:bg-mono-bg-dark"><LoadingSpinner /></div></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-4 border-t dark:border-mono-border-dark">
                        <div className="flex gap-2">
                            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Спросите о топ-продуктах..." className="flex-1 p-2 rounded border bg-transparent border-gray-300 dark:border-mono-border-dark text-gray-900 dark:text-mono-text-light focus:ring-gray-500 dark:focus:ring-mono-accent-dark focus:border-gray-500 dark:focus:border-mono-accent-dark" />
                            <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-gray-800 text-white dark:bg-mono-accent dark:text-black rounded disabled:opacity-50">Отправить</button>
                        </div>
                    </footer>
                </motion.div>
            </motion.div>,
            document.body
        );
    };
    
    // --- MAIN APP COMPONENT ---
    const App = () => {
      const [theme, setTheme] = useState('dark');
      const [user, setUser] = useState(null);
      const [authLoading, setAuthLoading] = useState(true);
      const [currentView, setCurrentView] = useState('Панель управления');
      const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [products, setProducts] = useState([]);
      const [productsLoading, setProductsLoading] = useState(true);
      const [orders, setOrders] = useState([]);
      const [ordersLoading, setOrdersLoading] = useState(true);
      const [toast, setToast] = useState(null);
      const [deleteConfirmation, setDeleteConfirmation] = useState(null);
      const [metrics, setMetrics] = useState({ growth: growthMetricsData, key: keyMetricsData, inventory: inventoryData, isPaused: false });
      const [explanationMetric, setExplanationMetric] = useState(null);
      const [aiInsight, setAiInsight] = useState('');
      const [isInsightLoading, setIsInsightLoading] = useState(true);
      const [isChatOpen, setIsChatOpen] = useState(false);
      const isMobile = useIsMobile();
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

      const { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } = window.FirebaseFirestore;
      
      const fetchAIInsight = useCallback(async () => {
        setIsInsightLoading(true);
        const metricsSnapshot = { ...metrics.growth, ...metrics.key };
        const metricsString = Object.values(metricsSnapshot).map(m => `${m.name}: ${m.value} (${m.change})`).join(', ');
        const prompt = `Act as a senior business analyst for a rapidly growing supplement company. Given the following snapshot of key metrics, provide a concise, actionable insight in 2-3 sentences in Russian. Focus on the most important trend and suggest a course of action. Metrics: ${metricsString}`;
        const insight = await generateContent(prompt);
        setAiInsight(insight);
        setIsInsightLoading(false);
      }, [metrics.growth, metrics.key]);
      
      useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        if (!auth) { console.error("Firebase Auth not available"); setAuthLoading(false); return; }
        const { onAuthStateChanged, signInAnonymously, signInWithCustomToken } = window.FirebaseAuth;
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) { setUser(u); setAuthLoading(false); } 
            else { try { if (typeof __initial_auth_token !== 'undefined') await signInWithCustomToken(auth, __initial_auth_token); else await signInAnonymously(auth); } catch(err) { console.error(err); setAuthLoading(false); }}
        });
        return () => unsub();
      }, []);
      
      useEffect(() => {
        if(user) fetchAIInsight();
      }, [user]);

      useEffect(() => {
        if (!db || !user) return;
        const userId = user.uid;
        const userProductsPath = `artifacts/${appId}/users/${userId}/products`;
        setProductsLoading(true);
        const unsub = onSnapshot(collection(db, userProductsPath), s => { setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))); setProductsLoading(false); }, e => { console.error(e); setProductsLoading(false); });
        return () => unsub();
      }, [user]);

      useEffect(() => {
        if (!db || !user) return;
        const userId = user.uid;
        const userOrdersPath = `artifacts/${appId}/users/${userId}/orders`;
        setOrdersLoading(true);
        const q = query(collection(db, userOrdersPath), orderBy("date", "desc"));
        const unsub = onSnapshot(q, s => { setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))); setOrdersLoading(false); }, e => { console.error(e); setOrdersLoading(false); });
        return () => unsub();
      }, [user]);

      useEffect(() => {
        if (metrics.isPaused) return;
        const interval = setInterval(() => setMetrics(prev => ({ ...prev, growth: simulateDataUpdate(prev.growth), key: simulateDataUpdate(prev.key), inventory: simulateDataUpdate(prev.inventory) })), 5000);
        return () => clearInterval(interval);
      }, [metrics.isPaused]);

      const createNotification = async (text) => {
          if (!db || !user) return;
          const userId = user.uid;
          const userNotificationsPath = `artifacts/${appId}/users/${userId}/notifications`;
          await addDoc(collection(db, userNotificationsPath), { text, timestamp: serverTimestamp(), read: false });
      };
      const handleShowToast = (message, type = 'success') => setToast({ id: Date.now(), message, type });

      const handleSaveProduct = async (productData) => {
        if (!db || !user) return;
        const userId = user.uid;
        const userProductsPath = `artifacts/${appId}/users/${userId}/products`;
        const getStatus = (stock) => stock > 10 ? 'В наличии' : stock > 0 ? 'Мало на складе' : 'Нет в наличии';
        const finalData = { ...productData, status: getStatus(productData.stock) };
        if (productData.id) { await updateDoc(doc(db, userProductsPath, productData.id), finalData); handleShowToast("Продукт обновлен!"); createNotification(`Продукт "${productData.name}" был обновлен.`); } 
        else { const { id, ...newData } = finalData; await addDoc(collection(db, userProductsPath), newData); handleShowToast("Продукт добавлен!"); createNotification(`Новый продукт "${productData.name}" был добавлен.`); }
      };
      
      const confirmDeleteProduct = async () => {
        if (!deleteConfirmation || !db || !user) return;
        const userId = user.uid;
        const userProductsPath = `artifacts/${appId}/users/${userId}/products`;
        await deleteDoc(doc(db, userProductsPath, deleteConfirmation));
        handleShowToast("Продукт удален.", "error");
        const p = products.find(p => p.id === deleteConfirmation);
        if (p) createNotification(`Продукт "${p.name}" был удален.`);
        setDeleteConfirmation(null);
      };
      
      const toggleTheme = useCallback(() => { 
        const newTheme = theme === 'dark' ? 'light' : 'dark'; 
        setTheme(newTheme); 
        document.documentElement.classList.toggle('dark', newTheme === 'dark'); 
        localStorage.setItem('theme', newTheme); 
      }, [theme]);
      
      const handleLogout = () => { if(auth) window.FirebaseAuth.signOut(auth); }
      const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

      const renderContent = () => {
        switch (currentView) {
          case 'Продукты': return <ProductsPage products={products} onSaveProduct={handleSaveProduct} onRequestDelete={setDeleteConfirmation} loading={productsLoading} />;
          case 'Заказы': return <OrdersPage orders={orders} loading={ordersLoading} />;
          case 'Отчеты': return <ReportsPage orders={orders} products={products} loading={ordersLoading || productsLoading} theme={theme} />;
          default: return <DashboardPage metrics={metrics} setMetrics={setMetrics} currentQuoteIndex={currentQuoteIndex} setCurrentQuoteIndex={setCurrentQuoteIndex} orders={orders} onMetricInfoClick={setExplanationMetric} aiInsight={aiInsight} isInsightLoading={isInsightLoading} onRefreshInsight={fetchAIInsight} />;
        }
      };
      
      if(authLoading) return <LoadingSpinner fullscreen={true} />
      if(!user) return <AuthPage onAuth={() => setAuthLoading(false)} />;

      return (
        <ErrorBoundary>
            <AnimatePresence>
              {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
              {deleteConfirmation && <ConfirmModal title="Подтвердите удаление" message="Вы уверены, что хотите удалить этот продукт?" onConfirm={confirmDeleteProduct} onCancel={() => setDeleteConfirmation(null)} />}
              {explanationMetric && <ExplanationModal metric={explanationMetric} onClose={() => setExplanationMetric(null)} />}
            </AnimatePresence>
            <AIChat open={isChatOpen} setOpen={setIsChatOpen} products={products} orders={orders} />
            <div className="min-h-screen text-gray-900 dark:text-mono-text-light flex flex-col">
              <Header theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} user={user} onLogout={handleLogout} onChatOpen={() => setIsChatOpen(true)} />
              <div className="flex flex-1 pt-16">
                  {!isMobile && <Sidebar currentView={currentView} setCurrentView={setCurrentView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />}
                  <main 
                    className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-mono-bg-dark transition-all duration-300 ease-in-out"
                    style={{ 
                        paddingLeft: isMobile ? 0 : (isSidebarCollapsed ? '5rem' : '16rem'),
                        paddingBottom: isMobile ? '4rem' : 0
                    }}
                  >
                      <AnimatePresence mode="wait"><motion.div key={currentView}>{renderContent()}</motion.div></AnimatePresence>
                      <Footer />
                  </main>
              </div>
              {isMobile && <BottomNavBar currentView={currentView} setCurrentView={setCurrentView} />}
            </div>
        </ErrorBoundary>
      );
    };

    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>

