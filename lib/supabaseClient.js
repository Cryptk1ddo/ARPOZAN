    import { createClient } from '@supabase/supabase-js'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    export const supabase = createClient(supabaseUrl, supabaseAnonKey)
    ```

3.  **Создайте таблицы в Supabase:** В вашей панели управления Supabase вам нужно будет создать таблицы, которые отражают структуру данных Firestore. Как минимум, вам понадобятся:
    * `products` (с колонками: `id`, `created_at`, `name`, `category`, `stock`, `price`, `imageUrl`, `description`, `status`, `user_id`).
    * `orders` (с колонками для деталей заказа и `user_id`).
    * `notifications` (с колонками для текста уведомления и `user_id`).
    * Важно добавить колонку `user_id` и настроить **Row Level Security (RLS)**, чтобы пользователи могли видеть и редактировать только свои данные. 

### Шаг 3: Замена аутентификации Firebase на Supabase Auth

Компонент `AuthPage` нужно будет переписать для работы с Supabase.

* **Firebase (до):**
    ```javascript
    await window.FirebaseAuth.signInWithEmailAndPassword(auth, email, password);
    ```
* **Supabase (после):**
    ```javascript
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    ```
    То же самое касается регистрации (`signUp`). Управление сессией пользователя в Next.js элегантно решается с помощью `supabase.auth.onAuthStateChange()` и React Context или `useUser` хука от Supabase.

### Шаг 4: Замена Firestore на базу данных Supabase

Это самая важная часть. Вам нужно будет заменить все вызовы Firestore на запросы к Supabase.

* **Чтение данных (например, продуктов):**
    * **Firebase (до):**
        ```javascript
        onSnapshot(collection(db, userProductsPath), (snapshot) => {
          // ...обновление состояния
        });
        ```
    * **Supabase (после):**
        ```javascript
        async function getProducts() {
          const { data: products, error } = await supabase
            .from('products')
            .select('*');
          if (error) console.error('Error fetching products:', error);
          else setProducts(products);
        }
        ```
    * **Для реального времени:** Если вам нужна такая же реактивность, как у `onSnapshot`, используйте **Supabase Realtime Subscriptions**.

* **Запись данных (например, добавление продукта):**
    * **Firebase (до):**
        ```javascript
        await addDoc(collection(db, userProductsPath), newData);
        ```
    * **Supabase (после):**
        ```javascript
        const { data, error } = await supabase
          .from('products')
          .insert([newData]);
        
