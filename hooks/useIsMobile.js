import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 1024) => { 
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Initial check
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        handleResize(); 

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};
```

### Следующие шаги для вас:

1.  **Установите зависимости:**
    ```bash
    npm install firebase framer-motion chart.js
    ```
2.  **Настройте Tailwind CSS:** Убедитесь, что ваш файл `tailwind.config.js` содержит плагин для `tailwindcss/forms` и настроен на использование `darkMode: 'class'`. Также скопируйте расширение `colors` из `index.html` в вашу конфигурацию.
3.  **Создайте `.env.local`:** В корне вашего проекта создайте файл `.env.local` и добавьте в него все ваши ключи Firebase и Gemini. Например:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=AI...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    # ...и так далее
    GEMINI_API_KEY=AI...
    
