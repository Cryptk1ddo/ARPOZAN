    export default async function handler(req, res) {
      if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
      }

      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        res.status(200).json({ text });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    ```
3.  **Вызывайте ваш API из компонентов:** Теперь ваши React-компоненты (например, `ProductModal` или `AIInsightCard`) будут делать запрос не к Google, а к вашему собственному API-маршруту:

    ```javascript
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: myPrompt })
    });
    const data = await response.json();
    // Используйте data.text
    
    