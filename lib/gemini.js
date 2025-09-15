export const generateContent = async (prompt) => {
  // Mock Gemini AI response for development
  // In production, this would call the actual Gemini API
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate mock responses based on prompt content
    if (prompt.includes('Центра действий')) {
      const actions = [
        "Пополнить запасы: Мака перуанская скоро закончится",
        "Обработать заказы: 2 заказа ожидают отправки",
        "Провести акцию для Йохимбин HCl - товар отсутствует на складе",
        "Проанализировать рост продаж Ultimate Pack - популярный товар"
      ];
      
      return JSON.stringify(actions.slice(0, Math.floor(Math.random() * 2) + 2));
    }
    
    if (prompt.includes('чат') || prompt.includes('ассистент')) {
      const responses = [
        "Добро пожаловать в админ-панель ARPOZAN! Как могу помочь с управлением магазином?",
        "Рекомендую обратить внимание на товары с низким остатком и обработать ожидающие заказы.",
        "Анализируя данные, вижу хорошие показатели продаж Ultimate Pack. Стоит увеличить маркетинг этого товара.",
        "Предлагаю настроить автоматические уведомления о критически низких остатках товаров."
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return "Спасибо за ваш запрос. Я анализирую данные и предоставлю рекомендации.";
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Не удалось получить ответ от ИИ-ассистента');
  }
};